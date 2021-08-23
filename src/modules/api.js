import axios from 'axios';
import { end } from 'cheerio/lib/api/traversing';

const END_POINT = '/v1/search/book.json';
const Client_ID = '6kzLim7jrHaqIQQcyTyH';
const Client_PW = 'TKnpNps3Gg';
const Search_Text = '해리포터';

// 비동기 작업 함수
export const getBestseller = (code) => {
    return axios.get(`${END_POINT}/bestseller`, code);
}

export const getLibrarychart = (criteria) => {
    return axios.get(`${END_POINT}/library`, criteria);
}

export const getSearchresult = (criteria) => {
    return axios.get(`${END_POINT}/search`, criteria);
}

export const getUserinfo = (username) => {
    return axios.post(`${END_POINT}/member/login`, username);
}

export const getBookinfo = (criteria) => {
    return axios.get(`${END_POINT}/result`, criteria);
}

export const updateUserinfo = (user) => {
    return axios.put(`${END_POINT}/member`, user);
}

export const deleteSearchhistory = (book) => {
    return axios.delete(`${END_POINT}/member/history`, book);
}

export const deleteUser = (username) => {
    return axios.delete(`${END_POINT}/member`, username);
}