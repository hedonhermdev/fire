export const API_BASE = 'http://dushyant.software:8000';

export const GET_PAGES_CONTENT = `${API_BASE}/permissions/get_cms_permission_data`;

export const GET_PAGE_GROUP_CONTENT = `${API_BASE}/content/page_group`;

export const GET_PAGE_DESCRIPTION_LIST = `${API_BASE}/content/description/list`;

export const GET_PAGE_DESCRIPTION = `${API_BASE}/content/description`;

export const ADD_PAGE_DESCRIPTION = `${API_BASE}/content/description/add`;

export const UPDATE_PAGE_DESCRIPTION = `${API_BASE}/content/description/modify/`;

export const DELETE_PAGE_DESCRIPTION = `${API_BASE}/content/description/delete/`;

export const LOGIN = `${API_BASE}/authentication/get_token`;

export const GET_BARS = `${API_BASE}/content/get_page_bars/`;

export const GET_PAGE_TEMPLATES = `${API_BASE}/content/get_template_list`;

export const ADD_PAGE = `${API_BASE}/content/page/add`;

export const ADD_PAGE_GROUP = `${API_BASE}/content/page_group/add`;

export const DELETE_PAGE_GROUP = `${API_BASE}/content/page_group/delete/`;

export const DELETE_PAGE = `${API_BASE}/content/page/delete/`;

export const EDIT_PAGE_GROUP = `${API_BASE}/content/page_group/modify/`;

export const EDIT_PAGE = `${API_BASE}/content/page/modify/`;