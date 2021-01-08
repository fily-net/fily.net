using System;
using System.Collections;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using Fily.Base;

namespace Fily.JSON
{
    public class Json: Hashtable
    {

        #region Json: 无参数构造函数
        public Json() : base() { }
        #endregion

        #region Json: 通过一个已经存在的Hashtable进行初始化
        public Json(Hashtable hash)
            : base()
        {
            foreach (DictionaryEntry de in hash)
            {
                this.Add(de.Key, de.Value);
            }
        }
        #endregion

        #region Json: 通过一个json格式字符串进行初始化
        public Json(string jsonStr)
            : base()
        {
            Json json = Json.Parse(jsonStr);
            foreach (DictionaryEntry de in json)
            {
                this.Add(de.Key, de.Value);
            }
        }
        #endregion

        #region Json: 通过一个已经存在的Hashtable进行初始化
        public static Json Parse(string jsonStr)
        {
            Json _json = new Json();
            try
            {
                JObject obj = JObject.Parse(jsonStr);
                JEnumerable<JToken> _children = obj.Children();
                foreach (JProperty field in _children)
                {
                    string name = field.Name;
                    string value = field.Value.ToString();
                    _json.Add(name, value);
                }
            }
            catch (Exception)
            {

            }
            return _json;
        }
        #endregion

        #region getLength: 得到长度
        public int getLength() { return base.Count; }
        #endregion

        #region this: 获取 或 设置 带有指定键的元素
        /// <summary>
        ///获取 或 设置 带有指定键的元素
        /// </summary>
        /// <param name="key">要获取或设置其值的键</param>
        /// <returns></returns>
        public override object this[object key]
        {
            get
            {
                if (key.Equals(null))//判断null值
                {
                    return null;
                }
                lock (this)
                {
                    if (ContainsKey(key))//是否存在该键 避免异常
                    {
                        return base[key];
                    }
                    else
                    {
                        return null;
                    }
                }
            }
            set
            {
                if (key.Equals(null))
                {
                    return;
                }
                lock (this)
                {
                    base[key] = value;
                }
            }
        }
        #endregion

        #region Add: 将带有指定键和值的元素添加到HashTableEx中 ,如果存在指定的键,则取消添加元素
        /// <summary>
        /// 将带有指定键和值的元素添加到HashTableEx中 ,如果存在指定的键,则取消添加元素
        /// </summary>
        /// <param name="key">要添加的元素的键</param>
        /// <param name="value">要添加的元素的值</param>
        public override void Add(object key, object value)
        {
            if (key.Equals(null)) { return; }
            lock (this)
            {
                if (ContainsKey(key))//是否存在该键 ,避免抛出异常
                {
                    return;
                }
                base.Add(key, value);
            }
        }
        #endregion

        #region Add: 将带有指定键和值的元素添加到Json中 ,如果该键已经存在根据ifOverride参数来决定是否覆盖之前的值
        /// <summary>
        ///  将带有指定键和值的元素添加到HashJson中
        /// </summary>
        /// <param name="key">要添加的元素的键</param>
        /// <param name="value">要添加的元素的值</param>
        /// <param name="ifOverride">如果已经存在是否覆盖原来的值</param>
        public virtual void Add(object key, object value, bool ifOverride)
        {
            if (key.Equals(null)){return;}
            lock (this)
            { 
                if (ContainsKey(key))
                {
                    if (ifOverride)
                    {
                        base[key] = value;
                    }
                    else {
                        return;
                    }
                }
                else
                {
                    base.Add(key, value);
                }
            }
        }
        #endregion

        #region Remove: 从Json对象中移除带有指定键的元素
        /// <summary>
        /// 从HashJson 中 移除带有指定键的元素
        /// </summary>
        /// <param name="key">要移除的元素的键</param>
        public override void Remove(object key)
        {
            if (key.Equals(null)) { return; }
            lock (this)
            {
                if (ContainsKey(key))//是否存在该键 避免异常
                {
                    base.Remove(key);
                }
            }
        }
        #endregion

        #region Remove: 从Json对象中移除带有指定键的元素, 并根据ifReturn来判断是否返回要删除键值对应的value值对象
        /// <summary>
        /// Remove: 从Json对象中移除带有指定键的元素, 并根据ifReturn来判断是否返回要删除键值对应的value值对象
        /// </summary>
        /// <param name="key">要移除的Key值</param>
        /// <param name="ifReturn">是否返回要删除键值对应的value值对象</param>
        /// <returns>返回对象</returns>
        public virtual JNode Remove(object key, bool ifReturn)
        {
            if (key.Equals(null)){ return null; }
            JNode o = null;
            lock (this)
            {
                if (ContainsKey(key))
                {
                    if (ifReturn) { o = new JNode(base[key]); }
                    base.Remove(key);
                }
            }
            return o;
        }
        #endregion

        #region Clone: 创建HashJson的副本
        /// <summary>
        /// 创建HashJson的副本
        /// </summary>
        /// <returns></returns>
        public virtual Json CloneBase()
        {
            Json hJson = new Json();
            lock (this)
            {
                foreach (DictionaryEntry dic in this)
                {
                    hJson.Add(dic.Key, dic.Value);
                }
            }
            return hJson;
        }
        #endregion

        #region Concat: 通过一个二维数组, 把数组中的每个元素加到自身对象中
        public virtual Json Concat(string [,] args)
        {
            try
            {
                for (int i = 0; i < args.Length; i++)
                {
                    this.Add(args[i, 0], args[i, 1]);
                }
            }
            catch (Exception e)
            {
                this["ERROR"] = Native.getErrorMsg(e.Message);
            }
            return this;
        }
        #endregion 

        #region Concat: 连接另一个Json对象
        public virtual Json Concat(Json json)
        {
            foreach (DictionaryEntry de in json)
            {
                this.Add(de.Key, de.Value);
            }
            return this;
        }
        #endregion 

        #region getInt: 通过key值得到int型的value值
        /// <summary>
        /// getInt: 通过key值得到int型的value值
        /// </summary>
        /// <param name="key">字符串(string)型key值<</param>
        /// <returns>返回int形式的value值</returns>
        public virtual int getInt(string key)
        {
            return get(key).toInt();
        }
        #endregion 

        #region getBool: 通过key值得到bool型的value值
        /// <summary>
        /// getBool: 通过key值得到bool型的value值
        /// </summary>
        /// <param name="key">字符串(string)型key值<</param>
        /// <returns>返回bool形式的value值</returns>
        public virtual bool getBool(string key)
        {
            return get(key).toBool();
        }
        #endregion 

        #region getString: 通过key值得到string型的value值
        /// <summary>
        /// getString: 通过key值得到string型的value值
        /// </summary>
        /// <param name="key">字符串(string)型key值<</param>
        /// <returns>返回string形式的value值</returns>
        public virtual string getString(string key)
        {
            return get(key).toString();
        }
        #endregion 

        #region getDouble: 通过key值得到double型的value值
        /// <summary>
        /// getDouble: 通过key值得到string型的value值
        /// </summary>
        /// <param name="key">字符串(double)型key值<</param>
        /// <returns>返回double形式的value值</returns>
        public virtual double getDouble(string key)
        {
            return get(key).toDouble();
        }
        #endregion 

        #region getDateTime: 通过key值得到DateTime型的value值
        /// <summary>
        /// getDateTime: 通过key值得到string型的value值
        /// </summary>
        /// <param name="key">字符串(DateTime)型key值<</param>
        /// <returns>返回DateTime形式的value值</returns>
        public virtual DateTime getDateTime(string key)
        {
            return get(key).toDateTime();
        }
        #endregion

        #region getArray: 通过key值得到Array型的value值
        /// <summary>
        /// getArray: 通过key值得到Array型的value值
        /// </summary>
        /// <param name="key">字符串(string)型key值<</param>
        /// <returns>返回Array形式的value值</returns>
        public virtual Array getArray(string key)
        {
            return get(key).toArray();
        }
        #endregion

        #region getJNode: 通过key值得到JNode型的value值
        /// <summary>
        /// getJNode: 通过key值得到JNode型的value值
        /// </summary>
        /// <param name="key">字符串(string)型key值<</param>
        /// <returns>返回JNode形式的value值</returns>
        public virtual JNode getJNode(string key)
        {
            return get(key).toJNode();
        }
        #endregion

        #region getObject: 通过key值得到object型的value值
        /// <summary>
        /// getObject: 通过key值得到object型的value值
        /// </summary>
        /// <param name="key">字符串(string)型key值<</param>
        /// <returns>返回object形式的value值</returns>
        public virtual object getObject(string key)
        {
            return get(key).toObject();
        }
        #endregion

        #region getJson: 通过key值得到HashJson型的value值
        /// <summary>
        /// getHashJson: 通过key值得到HashJson型的value值
        /// </summary>
        /// <param name="key">字符串(string)型key值<</param>
        /// <returns>返回HashJson形式的value值</returns>
        public virtual Json getJson(string key)
        {
            return get(key).toHashJson();
        }
        #endregion

        #region getValue(通过key值得到字符型的value值) setValue(给key值设置value值)
        /// <summary>
        /// getValue: 通过key值得到字符型的value值
        /// </summary>
        /// <param name="key">字符串(string)型key值<</param>
        /// <returns>返回字符串形式的value值</returns>
        public virtual string getValue(string key)
        {
            return this[key].ToString();
        }
        /// <summary>
        /// setValue: 给key值设置value值
        /// </summary>
        /// <param name="key">字符串(string)型key值</param>
        /// <param name="value">对象(string)型value值</param>
        public virtual void setValue(string key, object value)
        {
            this[key] = value;
        }
        #endregion 
        
        #region get(通过key值得到对象型的value值) set(通过key值得到对象型的value值)
        public virtual JNode get(object key)
        {
            return new JNode(this[key]);
        }
        public virtual void set(object key, object obj)
        {
            base[key] = obj;
        }
        #endregion 

        #region toDetail: 把自身的对象转成json格式的字符串
        public virtual string toDetail()
        {
            StringBuilder _sb = new StringBuilder();
            _sb.Append("{");
            foreach (DictionaryEntry de in this)
            {
                _sb.Append("\""+de.Key.ToString()+"\":\""+de.Value.ToString()+"\",");
            }
            _sb.Remove(_sb.Length - 1, 1);
            _sb.Append("}");
            return _sb.ToString();
        }
        #endregion 

        #region toHashJson: 把自身的对象转成json格式的字符串
        public virtual Json toJson(string[,] args)
        {
            Json _json = new Json();
            try{
                for (int i = 0; i < args.Length; i++ )
                {
                    _json.Add(args[i, 0], args[i, 1]);
                }
            }catch(Exception e){
                _json["ERROR"] = Native.getErrorMsg(e.Message);
            }
            return _json;
        }
        #endregion 
    }
}