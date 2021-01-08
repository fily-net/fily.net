using System;
using System.Collections.Generic;
using System.Web;

namespace Fily.Ext
{
    public class JsonNodeBU
    {
        /// <summary>
        /// JsonNode: 类似于javascript中json对象中的key, value对象
        /// </summary>

        #region 数据类型的定义: INT, BOOL, DOUBLE,STRING, JSONNODE, ARRAY, DATE, OBJECT;
        public static readonly string INT = "int";          //表示数据类型是int整形
        public static readonly string BOOL = "bool";         //表示数据类型是bool布尔型
        public static readonly string DOUBLE = "double";       //表示数据类型是double类型
        public static readonly string STRING = "string";       //表示数据类型是string字符串类型
        public static readonly string JSONNODE = "JsonNode";     //表示数据类型是JsonNode类型
        public static readonly string ARRAY = "array";        //表示数据类型是Array类型
        public static readonly string DATE = "date";         //表示数据类型是date日期类型
        public static readonly string OBJECT = "object";       //表示数据类型是object类型
        #endregion

        #region 私用变量的定义
        private string key;
        private string type;
        private object value;
        #endregion

        #region JsonNode: 构造函数, 通过传递不同的值进行json对象的构建
        public JsonNodeBU(string _key, int _value)
        {
            setValue(_key, _value);
        }
        public JsonNodeBU(string _key, bool _value)
        {
            setValue(_key, _value);
        }
        public JsonNodeBU(string _key, double _value)
        {
            setValue(_key, _value);
        }
        public JsonNodeBU(string _key, string _value)
        {
            setValue(_key, _value);
        }
        public JsonNodeBU(string _key, JsonNodeBU _value)
        {
            setValue(_key, _value);
        }
        public JsonNodeBU(string _key, Array _value)
        {
            setValue(_key, _value);
        }
        public JsonNodeBU(string _key, DateTime _value)
        {
            setValue(_key, _value);
        }
        public JsonNodeBU(string _key, object _value)
        {
            setValue(_key, _value);
        }
        #endregion

        #region setValue: 通过不同数据类型的值进行赋值
        public void setValue(string _key, int _value) 
        {
            key = _key;
            value = _value;
            type = INT;
        }
        public void setValue(string _key, bool _value)
        {
            key = _key;
            value = _value;
            type = BOOL;
        }
        public void setValue(string _key, double _value)
        {
            key = _key;
            value = _value;
            type = DOUBLE;
        }
        public void setValue(string _key, string _value)
        {
            key = _key;
            value = _value;
            type = STRING;
        }
        public void setValue(string _key, JsonNodeBU _value)
        {
            key = _key;
            value = _value;
            type = JSONNODE;
        }
        public void setValue(string _key, Array _value)
        {
            key = _key;
            value = _value;
            type = ARRAY;
        }
        public void setValue(string _key, DateTime _value)
        {
            key = _key;
            value = _value;
            type = DATE;
        }
        public void setValue(string _key, object _value)
        {
            key = _key;
            value = _value;
            type = OBJECT;
        }
        #endregion

        #region getIntValue, getBoolValue, getDoubleValue, getStringValue, getJsonNodeValue,getArrayValue, getDateValue, getObjectValue获取值
        public int getIntValue() { return (int)value; }
        public bool getBoolValue() { return (bool)value; }
        public double getDoubleValue() { return (double)value; }
        public string getStringValue() { return value.ToString(); }
        public JsonNodeBU getJsonNodeValue() { return (JsonNodeBU)value; }
        public Array getArrayValue() { return (Array)value; }
        public DateTime getDateValue() { return (DateTime)value; }
        public object getObjectValue() { return value; }
        #endregion

        #region getType: 得到字符串型的类型
        public string getType() { return type; }
        #endregion

        #region getKey: 得到键名
        public string getKey() { return key; }
        #endregion

        #region setKey: 设置键名
        public void setKey(string _key) { key = _key; }
        #endregion

        #region ToString: 重写父类Object的ToString方法
        public override string ToString() { return value.ToString(); }
        #endregion
    }
}