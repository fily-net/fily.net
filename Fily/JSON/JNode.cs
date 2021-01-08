using System;
using System.Collections.Generic;
using System.Web;

namespace Fily.JSON
{
    public class JNode
    {
        /// <summary>
        /// JsonNode: 类似于javascript中json对象中的key, value对象
        /// </summary>

        #region 私用变量的定义
        private object key;
        private object value;
        private string sys_type;
        #endregion

        #region JNode: 构造函数, 通过传递不同的值进行json对象的构建
        public JNode(object _value) { setValue(_value); }
        #endregion

        #region setValue: 通过不同数据类型的值进行赋值
        public void setValue(object _value) { value = _value; setSysKey(_value); }
        #endregion

        #region toInt, toBool, toDouble, toString, toJNode,toArray, toDate, toObject获取值
        public int toInt16() { return Convert.ToInt16(value); }
        public int toInt32() { return Convert.ToInt32(value); }
        public int toInt() { return Convert.ToInt32(value); }
        public bool toBool() { return Convert.ToBoolean(value); }
        public double toDouble() { return Convert.ToDouble(value); }
        public decimal toDecimal() { return Convert.ToDecimal(value); }
        public string toString() { return value.ToString(); }
        public JNode toJNode() { return (JNode)value; }
        public Array toArray() { return (Array)value; }
        public Json toHashJson() { return (Json)value; }
        public DateTime toDateTime() { return (DateTime)value; }
        public object toObject() { return value; }
        #endregion

        #region getType: 得到字符串型的类型
        public string getDataType() {
            string[] _aT = sys_type.ToString().Split('.');
            return _aT[_aT.GetLength(0) - 1];
        }
        public string getSysType() { return sys_type; }
        #endregion

        #region getKey setKey:
        public string getKey() { return key.ToString(); }
        public void setKey(object _key) { key = _key; }
        private void setSysKey(object _value) { if (_value == null) { sys_type = "Null"; } else { sys_type = _value.GetType().ToString(); } }
        #endregion

        #region ToString: 重写父类Object的ToString方法
        public virtual string toDetail() {
            string _key = String.Empty, _val = String.Empty, _dt = String.Empty, _ft = String.Empty;
            if (key != null) { _key = key.ToString(); }
            if (value != null) { 
                _dt = getDataType(); 
                _ft = getSysType();
                switch (_dt) { 
                    case "Json":
                        _val = ((Json)value).toDetail(); break;
                    case "JNode":
                        _val = ((JNode)value).toDetail(); break;
                    case "Int16":
                    case "Int32":
                    case "String":
                    case "Double":
                    case "Boolean":
                        _val = value.ToString(); break;
                    default:
                        _val = _ft;
                        break;
                }
            }
            return "{key:" + _key + ", value:" + _val + ",dataType:" + _dt + ",fullType:" + _ft + "}";
        }
        #endregion
    }
}