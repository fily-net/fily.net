using System;
using System.Collections.Generic;
using System.Web;

namespace Fily
{
    public static class R
    {
        public static class Table{
            /*车辆与机具*/
            public const string CAR_DRIVER = "dbo.CAR_DRIVER";
            public const string DE_CAR = "dbo.DEVICE_CAR";
            public const string DE_CAR_ACCIDENT = "dbo.DEVICE_CAR_ACCIDENT";
            public const string DE_CAR_APPLY = "dbo.DEVICE_CAR_APPLY";
            public const string DE_CAR_CHECK = "dbo.DEVICE_CAR_CHECK";
            public const string DE_CAR_DRIVING_RECORD = "dbo.DEVICE_CAR_DRIVING_RECORD";
            public const string DE_CAR_OIL = "dbo.DEVICE_CAR_OIL";
            public const string DE_CAR_REPAIR = "dbo.DEVICE_CAR_REPAIR";
            public const string DE_MACHINES = "dbo.DEVICE_MACHINES";
            public const string DE_MACHINES_REPAIR = "dbo.DEVICE_MACHINES_REPAIR";

            /*公文流转*/
            public const string DOC_WF = "dbo.DOC_WF";

            /*工程管理*/
            public const string PRO_MG = "dbo.PRO_MG";

            /*总务*/
            public const string GL_MS = "dbo.GENERAL_MS";
            public const string GL_MS_BATCH = "dbo.GENERAL_MS_BATCH";
            public const string GL_MS_STOCK = "dbo.GENERAL_MS_STOCK";
            public const string GL_RECEIVE = "dbo.GENERAL_RECEIVE";
            public const string GL_RECEIVE_DETAIL = "dbo.GENERAL_RECEIVE_DETAIL";
            public const string GL_SEND = "dbo.GENERAL_SEND";
            public const string GL_SEND_DETAIL = "dbo.GENERAL_SEND_DETAIL";

            /*系统公共模块*/
            public const string CM_LOGS = "dbo.SYS_CM_LOGS";
            public const string CM_API_DESC = "dbo.SYS_CM_API_DESC";
            public const string CM_FILES = "dbo.SYS_CM_FILES";
            public const string CM_FN_TREE = "dbo.SYS_CM_FN_TREE";
            public const string CM_FORUM = "dbo.SYS_CM_FORUM";
            public const string CM_GLOBAL_BTNSET = "dbo.SYS_CM_GLOBAL_BTNSET";
            public const string CM_GLOBAL_TABLE = "dbo.SYS_CM_GLOBAL_TABLE";
            public const string CM_HOLIDAY = "dbo.SYS_CM_HOLIDAY";
            public const string CM_MAIN_TREE = "dbo.SYS_CM_MAIN_TREE";
            public const string CM_MEETING = "dbo.SYS_CM_MEETING";
            public const string CM_NEWS = "dbo.SYS_CM_NEWS";
            public const string CM_NOTICE = "dbo.SYS_CM_NOTICE";
            public const string CM_ROLE = "dbo.SYS_CM_ROLE";
            public const string CM_UI = "dbo.SYS_CM_UI";
            public const string CM_USER = "dbo.SYS_CM_USER";
            
            /*工作流*/
            public const string WF_DEFINITION = "dbo.SYS_WF_DEFINITION";
            public const string WF_INDEX = "dbo.SYS_WF_INDEX";
            public const string WF_INSTANCE = "dbo.SYS_WF_INSTANCE";
            public const string WF_RULE = "dbo.SYS_WF_RULE";

            /*仓库(索引、物资结构、物资库存、物资批次)*/
            public const string WH_INDEX = "dbo.SYS_WH_INDEX";
            public const string WH_MS = "dbo.SYS_WH_MS";
            public const string WH_MS_STOCK = "dbo.SYS_WH_STOCK";
            public const string WH_MS_BATCH = "dbo.SYS_WH_STOCK_BATCH";
            
            /*仓库单据(领料单、收料单、退料单、调拨单)*/
            public const string TK_WH_ALLOCATE = "dbo.TK_WH_ALLOCATE";
            public const string TK_WH_ALLOCATE_DETAIL = "dbo.TK_WH_ALLOCATE_DETAIL";
            public const string TK_WH_BACK = "dbo.TK_WH_BACK";
            public const string TK_WH_BACK_DETAIL = "dbo.TK_WH_BACK_DETAIL";
            public const string TK_WH_RECEIVE = "dbo.TK_WH_RECEIVE";
            public const string TK_WH_RECEIVE_DETAIL = "dbo.TK_WH_RECEIVE_DETAIL";
            public const string TK_WH_SEND = "dbo.TK_WH_SEND";
            public const string TK_WH_SEND_DETAIL = "dbo.TK_WH_SEND_DETAIL";

            /*台账*/
            public const string TZ_COOPERATION = "dbo.TZ_COOPERATION";
            public const string TZ_FIRE_PLACE = "dbo.TZ_FIRE_PLACE";
            public const string TZ_FIRE_WARE = "dbo.TZ_FIRE_WARE";
            public const string TZ_FIRE_WF = "dbo.TZ_FIRE_WF";
            public const string TZ_HT = "dbo.TZ_HT";
            public const string TZ_MEASURE = "dbo.TZ_MEASURE";
            public const string TZ_MEASURE_WF = "dbo.TZ_MEASURE_WF";
            public const string TZ_ZICHAN = "dbo.TZ_ZICHAN";
            public const string TZ_ZICHAN_WF = "dbo.TZ_ZICHAN_WF";

            /*养护*/
            public const string YH_BASE_STATION = "dbo.YH_BASE_STATION";
            public const string YH_OTHER_SEND = "dbo.YH_OTHER_SEND";
            public const string YH_OTHER_SEND_DETAIL = "dbo.YH_OTHER_SEND_DETAIL";
            public const string YH_REPAIR_LEAKAGE = "dbo.YH_REPAIR_LEAKAGE";
            public const string YH_TASK = "dbo.YH_TASK";
            public const string YH_TASK_DETAIL = "dbo.YH_TASK_DETAIL";
        }
        public static class WorkFlow {
            /*流程状态*/
            public const string GOING = "449";  //正在进行中
            public const string OVER = "450";   //已经结束
            public const string CANCLE = "451"; //被取消
        }
    }
}