import { compile } from 'path-to-regexp';
import config from './config';


type Path = {
    path: string,
    toPath: Function
};

function createPathObject(path: string): Path {
    return {
        path: path,
        toPath: compile(path)
    };
}

export const root = createPathObject(config.baseurl);

export const admin = createPathObject(config.baseurl + 'admin');
export const dashboard = createPathObject(config.baseurl + 'admin/dashboard');
export const coins = createPathObject(config.baseurl + 'admin/coins');
export const addCoin = createPathObject(config.baseurl + 'admin/coins/add');
export const implanUpdate = createPathObject(config.baseurl + 'admin/implan/update/:id');
export const implanDetails = createPathObject(config.baseurl + 'admin/implan/:id');
export const scenarios = createPathObject(config.baseurl + 'admin/scenarios');
export const scenarioDetails = createPathObject(config.baseurl + 'admin/scenarios/:id');
export const login = createPathObject(config.baseurl + 'login');
export const create = createPathObject(config.baseurl + 'create');


