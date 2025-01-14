export const AUTH_ENDPOINTS = {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT_USER: '/auth/logout',
}
export const USER_ENDPOINTS = {
    UPDATE_USER: '/users/update'
}


export const FIELD_ENDPOINTS = {
    FETCH_USER_FIELDS: '/fields',
    FETCH_FIELD_BY_ID: (id) => `/fields/${id}`,
    CREATE_FIELD:'/fields',
    UPDATE_FIELD: (id) => `/fields/${id}`,
    DELETE_FIELD: (id) => `/fields/${id}`,
    ADD_FIELD_DATA:(id)=> `/fields/add-field-data/${id}`,
}

export const PAYMENT_ENDPOINTS = {
    FETCH_SUBSCRIPTIONS: '/subscriptions/allSubscriptions',
    INITIATE_PAYMENT: `/subscriptions/createOrder`,
    VERIFY_PAYMENT: `/subscriptions/verify-payment`,
}

export const ANALYTICS_ENDPOINTS = {
    FETCH_USERS_ALL_FIELD_ANALYSIS:'/analytics',
    GENERATE_ANALYSIS:(id)=>`/analytics/${id}/generate-analysis`
}