import * as mongoose from 'mongoose';

export interface IRepo {
    title: string,
    url: string,
    owner: string,
    useDefault: boolean,
    alternativeChangelog?: string,
    tags: Array<string>,
    created?: Date,
    updated?: Date
}

export class Repo implements IRepo {
    title: string;
    url: string;
    owner: string;
    useDefault: boolean;
    alternativeChangelog?: string;
    tags: Array<string>;
    created?: Date;
    updated?: Date;

    constructor(data: {
        title: string,
        url: string,
        owner: string,
        useDefault: boolean,
        alternativeChangelog?: string,
        tags: Array<string>
    }) {
        this.title = data.title;
        this.url = data.url;
        this.owner = data.owner;
        this.useDefault = data.useDefault;
        this.alternativeChangelog = data.alternativeChangelog;
        this.tags = data.tags;
        this.created = new Date();
        this.updated = new Date();
    }
}

export interface IUser {
    username: string,
    useStarredRepos: boolean,
    email?: string
    created: Date,
    updated: Date,
    repos: Array<IRepo>
}

export class User implements IUser {
    username: string;
    useStarredRepos: boolean;
    email?: string;
    created: Date;
    updated: Date;
    repos: Array<IRepo>

    constructor(data: {
        username: string,
        useStarredRepos: boolean,
        email?: string,
        repos: Array<IRepo>
    }) {
        this.username = data.username;
        this.useStarredRepos =  data.useStarredRepos;
        this.email = data.email;
        this.created = new Date();
        this.updated = new Date();
        this.repos = data.repos;
    }
}

export interface IUserModel extends User, mongoose.Document {}


let userSchema: mongoose.Schema = new mongoose.Schema({
    username: {type: String, require: true, unique: true},
    useStarredRepos: {type: Boolean, default: false},
    email: String,
    created: {type: Date, default: Date.now},
    updated: Date,
    repos: [{
        title: {type: String, require: true},
        url: {type: String, require: true}    ,
        useDefault: {type: Boolean, default: true},
        alternativeChangelog: String,
        tags: [String],
        created: {type: Date, default: Date.now},
        updated: Date
    }]
});

export default mongoose.model<IUserModel>('User', userSchema);
