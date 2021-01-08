using System;
using System.Collections.Generic;
using System.Collections;
using System.Web;
using System.Text;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;

namespace Fily.Ext
{
    public class HashJsonBU: Hashtable
    {
        #region 私有变量的定义
        private int length = 0;
        #endregion

        #region HashJson: 无参数构造函数
        public HashJsonBU() : base() { }
        #endregion

        #region HashJson: 通过一个已经存在的Hashtable进行初始化
        public HashJsonBU(Hashtable hash)
            : base()
        {
            foreach (DictionaryEntry de in hash)
            {
                this.Add(de.Key, de.Value);
            }
        }
        #endregion

        #region HashJson: 通过一个json格式字符串进行初始化
        public HashJsonBU(string jsonStr): base()
        {
            HashJsonBU json = HashJsonBU.Parse(jsonStr);
            foreach (DictionaryEntry de in json)
            {
                this.Add(de.Key, de.Value);
            }
        }
        #endregion

        #region HashJson: 通过一个已经存在的Hashtable进行初始化
        public static HashJsonBU Parse(string jsonStr)
        {
            HashJsonBU _json = new HashJsonBU();
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

        #region length属性的get, set方法
        public int getLength() { return length; }
        private void setLength(int len) { length = len; }
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
                    length++;
                }
            }
        }
        #endregion

        #region Remove: 从HashJson 中 移除带有指定键的元素
        /// <summary>
        /// 从HashJson 中 移除带有指定键的元素
        /// </summary>
        /// <param name="key">要移除的元素的键</param>
        public override void Remove(object key)
        {
            if (key.Equals(null)){return;}
            lock (this)
            {
                if (ContainsKey(key))//是否存在该键 避免异常
                {
                    base.Remove(key);
                    length--;
                }
            }
        }
        #endregion

        #region AddOrOverride: 将带有指定键和值的元素添加到HashJson中 ,如果该键已经存在 则将该键指定的旧值改为新值
        /// <summary>
        /// 将带有指定键和值的元素添加到HashJson中 ,如果该键已经存在 则将该键指定的旧值改为新值
        /// </summary>
        /// <param name="key">要添加的元素的键</param>
        /// <param name="value">要添加的元素的值</param>
        public virtual void AddOrOverride(object key, object value)
        {
            if (key.Equals(null)){return;}
            lock (this)
            { 
                if (ContainsKey(key))
                {
                    base[key] = value;
                }
                else
                {
                    base.Add(key, value);
                    length++;
                }
            }
        }
        #endregion

        #region RemoveKey: 获取带有指定键的元素 ,并从HashJson中移除指定键的元素
        /// <summary>
        /// 获取带有指定键的元素 ,并从HashJson中移除指定键的元素
        /// </summary>
        /// <param name="key">要添加的元素的键</param>
        /// <returns>返回移除的元素</returns>
        public virtual object RemoveKey(object key)
        {
            if (key.Equals(null)){ return null; }
            object o = null;
            lock (this)
            {
                if (ContainsKey(key))
                {
                    o = base[key];
                    base.Remove(key);
                    length--;
                }
                return o;
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
            if (key.Equals(null)){ return; }
            lock (this)
            {
                if (ContainsKey(key))//是否存在该键 ,避免抛出异常
                {
                    return;
                }
                base.Add(key, value);
                length++;
            }
        }
        #endregion

        #region Clone: 创建HashJson的副本
        /// <summary>
        /// 创建HashJson的副本
        /// </summary>
        /// <returns></returns>
        public virtual HashJsonBU CloneBase()
        {
            HashJsonBU hJson = new HashJsonBU();
            lock (this)
            {
                foreach (DictionaryEntry dic in this)
                {
                    hJson.Add(dic.Key, dic.Value);
                }
                return hJson;
            }
        }
        #endregion

        #region Concat: 通过一个二维数组, 把数组中的每个元素加到自身对象中
        public virtual HashJsonBU Concat(string [,] args)
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
                this["ERROR"] = e.Message;
            }
            return this;
        }
        #endregion 

        #region Concat: 连接另一个HashJson对象
        public virtual HashJsonBU Concat(HashJsonBU json)
        {
            foreach (DictionaryEntry de in json)
            {
                this.Add(de.Key, de.Value);
            }
            return this;
        }
        #endregion 

        #region getValue: 通过key值得到字符型的value值
        public virtual string getValue(string key)
        {
            return this[key].ToString();
        }
        #endregion 

        #region getObject: 通过key值得到对象型的value值
        public virtual object getObject(string key)
        {
            return this[key];
        }
        #endregion 

        #region getObject: 通过key值得到对象型的value值
        public virtual void setObject(string key, object obj)
        {
            this[key] = obj;
        }
        #endregion 

        #region setValue: 给key值设置value值
        /// <summary>
        /// setValue: 给key值设置value值
        /// </summary>
        /// <param name="key">字符串(string)型key值</param>
        /// <param name="value">对象(string)型value值</param>
        public virtual void setValue(string key, string value)
        {
            this[key] = value;
        }
        #endregion 

        /*
        #region toString: 把自身的对象输出成字符串
        public override string toString()
        {
            return toJsonStr();
        }
        #endregion
        */

        #region ToJsonStr: 把自身的对象转成json格式的字符串
        public virtual string ToJsonStr()
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

        #region ToJsonStr: 把自身的对象转成json格式的字符串
        public virtual HashJsonBU AryToHashJson(string [,] args)
        {
            HashJsonBU _json = new HashJsonBU();
            try{
                for (int i = 0; i < args.Length; i++ )
                {
                    _json.Add(args[i, 0], args[i, 1]);
                }
            }catch(Exception e){
                _json["ERROR"] = e.Message;
            }
            return _json;
        }
        #endregion 
    }
}