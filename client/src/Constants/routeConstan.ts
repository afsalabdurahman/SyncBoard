
export const ROUTES = {
  // Public Routes
  PUBLIC: {
    LANDING: '/',
    LOGIN: '/auth/user/login',
    ADMIN_LOGIN: 'auth/admin/login',
    SIGNUP: '/signup',
    FORGOT_PASSWORD: '/forgot-password',
    NOT_FOUND: '*',
    UNAUTHORIZED: '/unauthorized',
    GOOGLE_AUTH:'/auth/google',
    GOOGLE_ADMIN_AUTH:'/auth/admin/google',
    SUPER_AUTH:'/auth/super/login'

  },
  WORKSPACE:{
    BASE:'/workspace',
    CREATE_WORKSPACE:'/workspace/create',
    SEND_COMMENT:'/task/send/comment/:taskId', 
    FETCH_COMMENT:'/task/comments/:taskId',
    INVITATION_LINK:'/workspace/invite',
    ACTIVITIES:'/activities/all',
    FECTCH_ALL_USERS:'/workspace/member/pagination/data/:workspaceslug'
  },
  MEMBER:{
    SEND_OTP:'/auth/user/sendotp',
    VERIFY_OTP:'/auth/user/verifyotp',
    FIND_EMAIL:'/member/find/user/:email',
    RESEND_OTP:'/auth/user/forgot/password',
    CHANGE_PASSWORD:'/member/change/password/:userId',
    REGISTER_USER:'/auth/user/register',
    RESET_PASSWORD:'/member/reset/password/:userId',
    REMOVE_MEMBER:'/member/profile/update/:deleteUser',
    UPDATE_MEMBER:'member/profile/update/:userId',
   
  },
  CHECKOUT:{
    CHECKOUT_PAYMENT:'/checkout/payment/:userId'
  },
  SUSCRIPTIONS:{
    ALL_PLANS:'/subscription/active/plans',
    FETCH_SUBSCRIPTION:'subscription/mysubscription/:userId',
    UPDATE_SUBSCRIPTION:'/api/subscriptions/'
  },
  PROJECTS:{
    FETCH_PROJECT_NAMES:'/project/name/all/:workspaceId',
    COUNT_DASHBOARD:'/task/count/dashboard/:projectId',
    DONET_CHART:'/task/count/dashboard/donet/:projectId',
    MEMBERS_LIST:'/project/mebers/names/:projectId',
    CHART:'/project/burndown/chart/:projectId',
    LIST:'/task/project/list/:projectId',
    APPROVAL:'/task/project/approval/:projectId',
    FETCH_PROJECTS:'project/myprojects/:workspaceId',
    DELETE_PEOJECT:'project/delete/:projectId',
    CREATE_PROJECT:'project/create/:workspaceid',
    UPDATE_PROJECT:'project/update/:projectId'
  },
  TICKETS:{
    MY_TICKETS:'ticket/mytickets/:workspaceId',
    CREATE:'ticket/create',
    UPDATE_MEG:'ticket/update/message/:id'
  },
  TASKS:{
    FETCH_TASK: 'task/completed/:workspaceId',
    STATUS_UPDATE:'task/update/approval/status/:taskId',
    DELETE_ATTACHMENTS:'task/attachment/delete/:taskId',
    DELETE_SUBTASKS:'task/delete/subtask/:taskId',
    DELETE_PROJECT_ATTTACHMENT:'project/delete/attachment/:projectId',
    CREATE :'task/create',
    UPDATE:'task/update/:id',
    DELETE:'task/delete/:deleteTaskId'
  },
  SUPER_ADMIN:{
    DASHBOARD:'super/counts',
    DOWNLOAD_EXCEL:'workspace/download/workspace',
    CREATE_PLAN:'super/create/plan',
    UPDATE_PLAN:'super/update/plan/:id',
    REMOVE_PLAN:'super/plan/remove/:id',
    DELETE_PLAN:'super/plan/delete/:id',
    SUPER_ADMIN_WORKSPACE_DATA:'super/count/workspace',
    SUPER_ADMIN_USER_LIST:'workspace/member/pagination/data/:workspaceslug',
    SUPER_ADMIN_UPDATE_WORKSPACE:'workspace/update/:id',
    USER_PAGE:'super/count/users',
    SUBSCRIPTION_PAGE:'super/count/subscription',
    ABUSE_REPORT_PAGE:'workspace/abuse/reports',
    UPDATE_ABUSE_REPORT:'workspace/abuse/report/status/:reportId',
    UPDATE_TICKET_STATUS:'ticket/update/status/:ticketId',
    SUPER_PLANS:'super/plans',
    FETCH_REVENUE:'super/revenue/subscription',
    GROWTH_CHART:'super/user/growth',
    UPDATE_USER:'member/profile/update/:userId'
  },
  TOKEN:{
    REFRESH_TOKEN:'/auth/refresh-token'
  }
  
}