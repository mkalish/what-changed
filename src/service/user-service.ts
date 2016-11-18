import { isDate } from 'util';
import * as console from 'console';
import * as user from '../model/model';
import { IRepo, IUser, Repo } from '../model/model';
import RepoService from './repo-service';

const octokat = require('octokat');
const githubApiToken = require('../github-token.json').token;

const github = new octokat({token: githubApiToken});



const service = {
    createUser: (userName: string): Promise<Array<IUser>> => {
        return RepoService.getUserRepos()
            .then((repos) => {
                return user.default.create({
                    username: userName,
                    repos: repos,
                    email: 'kalishmichael@gmail.com'
                });
            });
    },
    findUsers: (): Promise<Array<IUser>> => {
        return user.default.find().exec();
    }
}

export default service;