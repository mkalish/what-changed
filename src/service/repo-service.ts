import { O_DIRECT } from 'constants';
import { IRepo, Repo } from '../model/model';


const octokat = require('octokat');
const githubApiToken = require('../github-token.json').token;

const github = new octokat({token: githubApiToken});

const service = {
    getUserRepos: (): Promise<IRepo[]> => {
        return github.me.starred.fetch()
            .then((stars) => {
                return stars.map((star) => {
                    return new Repo({title: (<string>star.name), 
                        url: (<string>star.url),
                        owner: (<string>star.owner.login), 
                        useDefault: true, 
                        tags: []})
                });
            });
    },
    getChangeLog: (repo: IRepo) => {
        const theRepo = github.repos(repo.owner, repo.url);
        if(repo.useDefault) {
            return theRepo.contents('CHANGELOG.md').fetch();
        }
    }
}

export default service;