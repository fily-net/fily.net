<%@ Page Language="C#" AutoEventWireup="true" EnableViewState="false" Debug="True" validateRequest="false" %>
<%@ outputcache Duration="5" VaryByParam="*" %>
<%@ Import Namespace="Fily.Base" %>
<%@ Import Namespace="Fily.Data" %>
<%@ Import Namespace="Fily.JSON" %>
<%@ Import Namespace="Fily.IO" %>
<%@ Import Namespace="Fily.WorkFlow" %>
<%@ Import Namespace="Fily.Util" %>
<% 
    
    MsSqlDBHelper help = new MsSqlDBHelper("Net_Release");
    BaseApi baseApi = new BaseApi(help);
    string action = Native.getAction(), responseText = String.Empty;
    string T_INDEX = "SYS_WF_INDEX", T_RULE = "SYS_WF_RULE", T_INSTANCE = "SYS_WF_INSTANCE", T_DEFINITION = "SYS_WF_DEFINITION";
    string [,] args;
    Json hash = null;
    WFIndex index;
    switch (action) {
        case "pagingForRightsWFList":
            args = new string[,] { 
                { "fileName", "SYS_WF_INSTANCE" },
                { "keyFields", "*" },
                { "pageIndex", "1" },
                { "pageSize", "20" },
                { "jsonCondition", "1=1"},
                { "orderCondition", "{\"cTime\":\"desc\"}" },
                { "filterCondition", "" },
                { "delFlag", "0" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _where = MConvert.toWhereSql(hash.getValue("jsonCondition")), _filter = MConvert.toFilterSql(hash.getValue("filterCondition"));
                if (_where.Length > 0 && _filter.Length > 0)
                {
                    _where += " and " + _filter;
                }
                else if (_filter.Length > 0)
                {
                    _where = _filter;
                }
                string _strDownload = Request["jsonDownload"], _title = String.Empty;
                if (!Native.isNullEmpty(_strDownload)) { baseApi.setRSplit("\r\n\""); baseApi.setCSplit(","); _title = MConvert.toKV(_strDownload)[1].Replace("'", ""); }
                responseText = baseApi.paging("SYS_WF_INSTANCE", hash.getInt("pageIndex"), hash.getInt("pageSize"), hash.getValue("keyFields"), _where + " and pid=0 and dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', owner,',',0)<>0", MConvert.toOrderSql(hash.getValue("orderCondition")), hash.getInt("delFlag"));
                if (!Native.isNullEmpty(_strDownload))
                {
                    string _strContent = _title + "\r\n" + responseText.Split(baseApi.getReSplit().ToCharArray())[0].Replace(baseApi.getRSplit(), "\r\n");
                    MFile.exportCsv(hash.getValue("fileName") + ".csv", _strContent);
                    return;
                }
            }
            break;
        case "getWFRuleTemplate":
            args = new string[,] { 
                { "keyFields", "*" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.selectTree(T_RULE, hash.getValue("keyFields"), "pid=1 and oid=-1");
            }
            break;
        case "getWFIndex":
            args = new string[,] { 
                { "keyFields", "*" },
                { "jsonCondition", "{\"pid\":1}" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.selectTree(T_INDEX, hash.getValue("keyFields"), MConvert.toWhereSql(hash.getValue("jsonCondition")));
            }
            break;
        case "getDefinitionById":
            args = new string[,] {  
                { "keyFields", "*" },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                baseApi.setDataType("html");
                responseText = baseApi.select(T_INDEX, "json", "id=" + hash.getValue("id"));
                baseApi.setDataType("json");
                responseText += baseApi.getReSplit() + baseApi.select(T_DEFINITION, hash.getValue("keyFields"), "oid=" + hash.getValue("id"));
            }
            break;
        case "getPersonFormUserOrRole":
            args = new string[,] { 
                { "type", "user" },
                { "keyFields", "id,uid" },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _dID = hash.getValue("id"), _type = hash.getValue("type");
                    string _sVal = _trans.execScalar(MString.getSelectStr(T_DEFINITION, _type+'s', "id=" + _dID));
                    if (_sVal.Length > 1) {
                        _sVal = _sVal.Substring(1, _sVal.Length - 2);
                        responseText = _trans.execReader(MString.getSelectStr("SYS_CM_" + _type, hash.getValue("keyFields"), "id in (" + _sVal + ")"));
                    }
                    _trans.commit();
                }
                catch (Exception e)
                {
                    responseText = Native.getErrorMsg(e.Message);
                    _trans.rollback();
                }
                finally
                {
                    _trans.close();
                }
            }
            break;
        case "getDefinitionNodeRuleById":
            args = new string[,] { 
                { "keyFields", "*" },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _defintedID = hash.getValue("id");
                    string _sql = MString.getSelectStr(T_RULE, hash.getValue("keyFields"), "oid=" + _defintedID) + MString.getSelectStr(T_DEFINITION, "logicState, users as uValue, dbo.SYS_TRANS_USERS(users) as uText, roles as rValue, dbo.SYS_TRANS_ROLES(roles) as rText", "id=" + _defintedID);
                    _sql += MString.getSelectStr(T_RULE, "nodeName", "id=(select top 1 pid from "+T_RULE+" where delFlag=0 and oid="+_defintedID+")");
                    responseText = _trans.execReader(_sql);
                    _trans.commit();
                }
                catch (Exception e) {
                    responseText = Native.getErrorMsg(e.Message);
                    _trans.rollback();
                }finally {
                    _trans.close();
                }
            }
            break;
        case "getDefinitionNodeInfoById":
            args = new string[,] { 
                { "keyFields", "*" },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    string _defintedID = hash.getValue("id");
                    string _sql = MString.getSelectStr(T_DEFINITION, hash.getValue("keyFields"), "id=" + _defintedID);
                    responseText = _trans.execReader(_sql);
                    _trans.commit();
                }
                catch (Exception e)
                {
                    responseText = Native.getErrorMsg(e.Message);
                    _trans.rollback();
                }
                finally
                {
                    _trans.close();
                }
            }
            break;
        case "updateRuleItemValue":
            args = new string[,] { 
                { "itemValue", null },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateById(T_RULE, "itemValue='" + hash.getValue("itemValue") + "'", hash.getInt("id"));
            }
            break;
        case "bindRuleForNode":
            args = new string[,] { 
                { "keyFields", "*" },
                { "tempID", null },
                { "nodeID", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                string _oid = hash.getString("nodeID"), _tID = hash.getValue("tempID");
                try
                {
                    string _count = _trans.execScalar(MString.getSelectStr(T_RULE, "COUNT(*)", "oid=" + _oid));
                    if (_count != "0") { _trans.execNonQuery(MString.getRealDeleteStr(T_RULE, "oid=" + _oid)); }
                    string _keyF = "pid,depth,parentPath,nodeName,itemKey,itemValue,enabled,type,ext,note,cPerson";
                    _trans.execNonQuery("insert into {0} ({1}) select {2} from {0} where oid=-1 and pid={3};", T_RULE, "oid," + _keyF, _oid + "," + _keyF, _tID);
                    responseText = _trans.execReader(MString.getSelectStr(T_RULE, hash.getValue("keyFields"), "oid=" + _oid));
                    _trans.commit();
                }
                catch (Exception e)
                {
                    responseText = Native.getErrorMsg(e.Message);
                    _trans.rollback();
                }
                finally {
                    _trans.close();
                }
            }
            break;
        case "updateIndexJsonById": 
            args = new string[,] { 
                { "json", null },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateById(T_INDEX, "json='" + hash.getValue("json")+"'", hash.getInt("id"));
            }
            break;
        case "updateIndexById":
            args = new string[,] { 
                { "json", null },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateById(T_INDEX, MConvert.toUpdateSql(hash.getValue("json")), hash.getInt("id"));
            }
            break;
        case "updateDefinitedNodeById":
            args = new string[,] { 
                { "json", null },
                { "id", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.updateById(T_DEFINITION, MConvert.toUpdateSql(hash.getValue("json")), hash.getInt("id"));
            }
            break;
        case "toWFDefinition":
            args = new string[,] { 
                { "definitionJson", null },
                { "idxId", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                index = new WFIndex(hash.getInt("idxId"), baseApi);
                responseText = index.toDefinition(hash.getValue("definitionJson"));
            }
            break;
        case "reToWFDefinition":
            args = new string[,] { 
                { "definitionJson", null },
                { "idxId", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                index = new WFIndex(hash.getInt("idxId"), baseApi);
                responseText = index.reToDefinition(hash.getValue("definitionJson"));
            }
            break;
        case "addWFIndex":
            args = new string[,] { 
                { "type", "" },
                { "pid", null },
                { "json", null },
                { "appId", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                //baseApi.addTreeNode(T_INDEX,);
                //responseText = index.addInstance(hash.getInt("fnId"), hash.getInt("appId"), hash.getString("alias"));
            }
            break;
        case "delWFIndex":
            args = new string[,] { 
                { "id", "" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.deleteTreeNode(T_INDEX, hash.getInt("id"));
            }
            break;
        case "addWFInstance":
            args = new string[,] { 
                { "alias", "测试" },
                { "idxId", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                index = new WFIndex(hash.getInt("idxId"), baseApi);
                responseText = index.addInstance(hash.getString("alias"), "View/test/TestWF.js");
            }
            break;
        case "delWFInstance":
            args = new string[,] { 
                { "instanceID", "" }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                SqlTrans _trans = new SqlTrans(baseApi);
                try
                {
                    Native.setDebug(Native.DEBUG_INFO);
                    responseText = _trans.deleteTreeNode(T_INSTANCE, hash.getInt("instanceID"));
                    _trans.commit();
                }
                catch (Exception e)
                {
                    _trans.rollback();
                    responseText = Native.getErrorMsg(e.Message);
                }
                finally {
                    _trans.close();
                }
            }
            break;
        case "getWFInstanceByIdxId":
            args = new string[,] { 
                { "keyFields", null },
                { "idxId", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.select(T_INSTANCE, hash.getValue("keyFields"), " pid=0 and pre=0 and oid=" + hash.getValue("idxId"), "cTime", "desc");
            }
            break;
        case "getWFCurrState":
            args = new string[,] { 
                { "keyFields", "*" },
                { "instanceId", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _sql = MString.getSelectStr(T_INSTANCE, hash.getValue("keyFields") + ",dbo.SYS_TRANS_WF_DEFINITION(next) as trans_next", "state=1 and pid=" + hash.getValue("instanceId"));
                _sql += MString.getSelectStr(T_INSTANCE, "id,dbo.SYS_TRANS_RIGHTS('" + MSession.get(MSession.getClientKey()) + "', owner,',',0) as rvalue, cPerson, dbo.SYS_TRANS_USER(mPerson) as mPerson_trans, state, link", "id=" + hash.getValue("instanceId"));
                _sql += MString.getSelectStr("SYS_CM_ROLE", "charindex('," + MSession.get(MSession.getClientKey()) + ",',uids) as v", "id=8");
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "getWFCurrDetail":
            args = new string[,] { 
                { "keyFields", "*" },
                { "instanceId", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                string _sql = MString.getSelectStr(T_INSTANCE, hash.getValue("keyFields"), "pid=" + hash.getValue("instanceId"));
                responseText = baseApi.execQuery(_sql);
            }
            break;
        case "next":
            args = new string[,] { 
                { "currId", null },
                { "nextId", null },
                { "json", "" },
                { "ext", "" },
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                WFInstance instance = new WFInstance(baseApi);
                responseText = instance.next(hash.getInt("currId"), hash.getInt("nextId"), hash.getValue("json"), hash.getValue("ext"));
                
            }
            break;
        case "deny":
            args = new string[,] { 
                { "currId", null },
                { "nextId", null },
                { "json", "" },
                { "ext", "" },
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                WFInstance instance = new WFInstance(baseApi);
                responseText = instance.denyPARALLEL(hash.getInt("currId"), hash.getInt("nextId"), hash.getValue("json"), hash.getValue("ext"));

            }
            break;
        case "cancle":
            args = new string[,] { 
                { "wfId", null },
                { "json", "" },
                { "ext", "" },
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                WFInstance instance = new WFInstance(baseApi);
                responseText = instance.cancle(hash.getInt("wfId"), hash.getValue("json"), hash.getValue("ext"));

            }
            break;
        case "reStart":
            args = new string[,] { 
                { "wfId", null },
                { "json", "" },
                { "ext", "" },
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                WFInstance instance = new WFInstance(baseApi);
                responseText = instance.reStart(hash.getInt("wfId"), hash.getValue("json"), hash.getValue("ext"));

            }
            break;
        case "rePaint":
            args = new string[,] { 
                { "idxId", null }
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery(MString.getDeleteStr(T_DEFINITION, "oid=" + hash.getInt("idxId")));
            }
            break;
        case "updateWFFiles":
            args = new string[,] { 
                { "wfId", null },
                { "files", "" },
            };
            hash = Native.checkArgs(args, true);
            if (hash.getBool(Native.CHECK_RESULT))
            {
                responseText = baseApi.execQuery(MString.getUpdateStr(T_INSTANCE, "link=link+'" + hash.getValue("files") + ",'", hash.getInt("wfId")));
            }
            break;
        default :
            responseText = Native.getErrorMsg("调用接口不对或不存在");
            break;
    }
    Native.writeToPage(responseText); 
%>