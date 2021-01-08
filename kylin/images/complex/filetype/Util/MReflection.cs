using System;
using System.Collections.Generic;
using System.Web;
using System.Reflection;
using Fily.Base;

namespace Fily.Util
{
    public class MReflection
    {
        #region 私有变量的定义
        private Type _Type;
        private object _Class;
        #endregion

        #region MReflection: 构造函数
        public MReflection() { }
        /// <summary>
        /// 反射对象的构建
        /// </summary>
        /// <param name="_assembly">程序集名称, 如: 在项目的bin目录下有Fily.dll这个动态链接库, 如果要记在Fily.dll, Fily就是程序集名称</param>
        /// <param name="_classPath">ClassPath表示完整的类名名称, 如: 在命名空Fily.Util下有Logger这个类, ClassPath就是Fily.Util.Logger</param>
        public MReflection(string _assembly, string _classPath) { loadClass(_assembly, _classPath); }
        /// <summary>
        /// 反射对象的构建
        /// </summary>
        /// <param name="_assembly">程序集名称, 如: 在项目的bin目录下有Fily.dll这个动态链接库, 如果要记在Fily.dll, Fily就是程序集名称</param>
        /// <param name="_namespace">表示命名空间 如: Fily.Base</param>
        /// <param name="_classname">命名空间下具体的类名, 如:Logger</param>
        public MReflection(string _assembly, string _namespace, string _classname) { loadClass(_assembly, _namespace, _classname); }
        #endregion

        #region loadClass: 加载类
        /// <summary>
        /// loadClass: 加载类
        /// </summary>
        /// <param name="_assembly">程序集名称, 如: 在项目的bin目录下有Fily.dll这个动态链接库, 如果要记在Fily.dll, Fily就是程序集名称</param>
        /// <param name="_classPath">ClassPath表示完整的类名名称, 如: 在命名空Fily.Util下有Logger这个类, ClassPath就是Fily.Util.Logger</param>
        public void loadClass(string _assembly, string _classPath) {
            //Assembly.LoadFrom("Fily.dll")
            _Type = Assembly.Load(_assembly).GetType(_classPath);
            if (_Type == null) { return; }
            try
            {
                _Class = Activator.CreateInstance(_Type, new object[] { });
            }
            catch (Exception e) {
                Native.writeToPage(Native.getErrorMsg(e.Message));
            }
        }
        /// <summary>
        /// loadClass: 加载类
        /// </summary>
        /// <param name="_assembly">程序集名称, 如: 在项目的bin目录下有Fily.dll这个动态链接库, 如果要记在Fily.dll, Fily就是程序集名称</param>
        /// <param name="_namespace">表示命名空间 如: Fily.Base</param>
        /// <param name="_classname">命名空间下具体的类名, 如:Logger</param>
        public void loadClass(string _assembly, string _namespace, string _classname)
        {
            loadClass(_assembly, string.Concat(_namespace, ".", _classname));
        }
        #endregion

        #region getMethodInfos: 获取类的所有方法信息
        public MethodInfo[] getMethodInfos() {
            return _Type.GetMethods();
        }
        #endregion

        #region getMethodInfo: 根据方法名获取方法信息
        /// <summary>
        /// getMethodInfo: 根据方法名获取方法信息
        /// </summary>
        /// <param name="_methodName">方法名</param>
        /// <returns></returns>
        public MethodInfo getMethodInfo(string _methodName) {
            return _Type.GetMethod(_methodName);
        }
        #endregion

        #region getFieldInfos: 获取类的所有属性(或字段)
        public FieldInfo [] getFieldInfos()
        {
            return _Type.GetFields();
        }
        #endregion

        #region getFieldInfo: 根据属性名获取字段信息
        /// <summary>
        /// getMethodInfo: 根据方法名获取方法信息
        /// </summary>
        /// <param name="_methodName">方法名</param>
        /// <returns></returns>
        public FieldInfo getFieldInfo(string _methodName)
        {
            return _Type.GetField(_methodName);
        }
        #endregion

        #region invokeStatic: 执行类中的静态且有参数方法(注: 静态且有参数)
        /// <summary>
        /// invokeStatic: 执行类中的静态且有参数方法
        /// </summary>
        /// <param name="methodName">方法名</param>
        /// <param name="args">参数, 以逗号分隔开</param>
        /// <returns></returns>
        public object invokeStatic(string methodName, params object [] args) { 
            MethodInfo _mInfo = getMethodInfo(methodName);
            return _mInfo.Invoke(null, args);
        }
        #endregion

        #region invokeStaticNoArgs: 执行类中的静态且无参数方法(注: 静态且无参数)
        /// <summary>
        /// invokeStaticNoArgs: 执行类中的静态且无参数方法(注: 静态且无参数)
        /// </summary>
        /// <param name="methodName">方法名</param>
        /// <returns></returns>
        public object invokeStaticNoArgs(string methodName)
        { 
            MethodInfo _mInfo = getMethodInfo(methodName);
            return _mInfo.Invoke(null, null);
        }
        #endregion

        #region invokeNoArgs: 执行类中的非静态且无参数方法
        /// <summary>
        /// invokeNoArgs: 执行类中的非静态且无参数方法(注: 非静态且无参数)
        /// </summary>
        /// <param name="methodName">方法名</param>
        /// <returns></returns>
        public object invokeNoArgs(string methodName)
        {
            return _Type.InvokeMember(methodName, BindingFlags.InvokeMethod, null, _Class, null); ;
        }
        #endregion

        #region invoke: 执行类中的非静态且有参数方法
        /// <summary>
        /// invoke: 执行类中的非静态且有参数方法(注: 非静态且有参数)
        /// </summary>
        /// <param name="methodName">方法名</param>
        /// <param name="args">参数, 以逗号分隔开</param>
        /// <returns></returns>
        public object invoke(string methodName, params object [] args)
        {
            MethodInfo _mInfo = _Type.GetMethod(methodName);
            return _mInfo.Invoke(_Class, args);
        }
        #endregion

        #region invokePrivate: 执行类中的静态私有方法
        /// <summary>
        /// invoke: 执行类中的非静态且有参数方法(注: 非静态私有且有参数)
        /// </summary>
        /// <param name="methodName">方法名</param>
        /// <param name="args">参数, 以逗号分隔开</param>
        /// <returns></returns>
        public object invokePrivate(string methodName, params object[] args)
        {
            BindingFlags bf = BindingFlags.Instance | BindingFlags.NonPublic;
            MethodInfo _mInfo =  _Type.GetMethod(methodName, bf);
            return _mInfo.Invoke(_Class, args);
        }
        #endregion

        #region invokePrivate: 执行类中的静态私有方法
        /// <summary>
        /// invoke: 执行类中的非静态且有参数方法(注: 非静态私有且无参数)
        /// </summary>
        /// <param name="methodName">方法名</param>
        /// <returns></returns>
        public object invokePrivateNoArgs(string methodName)
        {
            BindingFlags bf = BindingFlags.Instance | BindingFlags.NonPublic;
            MethodInfo _mInfo = _Type.GetMethod(methodName, bf);
            return _mInfo.Invoke(_Class, null);
        }
        #endregion
    }
}