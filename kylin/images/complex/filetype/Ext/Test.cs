using System;
using System.Reflection;

namespace Mengliao.CSharp.C13.S02
{
    class MyClass
    {
        private int count;

        public MyClass(int value)
        {
            count = value;
        }

        public void m1()
        {
            Console.WriteLine("Called method 1.");
        }

        public static int m2(int x)
        {
            return x * x;
        }

        public void m3(int x, double y)
        {
            Console.WriteLine("Called method 3, paramaters: x = {0}, y = {1:E}.", x, y);
        }

        public void m4()
        {
            Console.WriteLine("Called method 4. Count = {0}", count);
        }

        private static string m5(double x) //私有静态方法，不能直接调用，但可以绑定到委托  
        {
            return Math.Sqrt(x).ToString();
        }
    }

    class Program
    {
        public static void Main()
        {
            //取得MyClass的Type对象，下面的代码使用Type的静态方法需指明程序集，作用相同  
            //Type t = Type.GetType("Mengliao.CSharp.C13.S02.MyClass, ConsoleApplication, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null");  
            Type t = typeof(MyClass);
            //通过Activator实例化MyClass，供实例方法调用  
            object obj = Activator.CreateInstance(t, new object[] { 88 });

            MethodInfo[] methods = t.GetMethods(); //获取MyClass的所有方法列表  

            foreach (MethodInfo nextMethod in methods) //枚举所有方法  
            {
                Console.WriteLine(nextMethod.ToString()); //显示方法信息  
                if (nextMethod.Name == "m1") //方法m1  
                {
                    nextMethod.Invoke(obj, null); //使用obj对象调用方法m1，无参数  
                }
                if (nextMethod.Name == "m2") //方法m2  
                {
                    //静态方法，使用null调用方法m2，建立参数数组，传入10  
                    Console.WriteLine("Called static method 2, return {0}", nextMethod.Invoke(null, new object[] { 10 }));
                }
            }

            MethodInfo m3Info = t.GetMethod("m3"); //获取方法m3  
            m3Info.Invoke(obj, new object[] { 123, 0.456 }); //调用方法m3，传入对应的2个参数  

            //获取方法m4，使用obj对象调用方法，无参数  
            t.InvokeMember("m4", BindingFlags.InvokeMethod, null, obj, null);

            //建立泛型委托runMe，并绑定MyClass的静态私有方法m5  
            //Delegate runMe = Delegate.CreateDelegate(typeof(Func<double, string>), t, "m5");
            //Console.WriteLine("Call delegate with m5: Sqrt(2) = {0}", ((Func<double, string>)runMe)(2)); //调用该委托  

            Console.ReadLine();
        }
    }
}