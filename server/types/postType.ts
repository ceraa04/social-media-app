import { Types } from 'mongoose';
import { userType } from './userType';
import { commentType } from './commentType';
export type postType = {
    creator: userType;
    img: string,
    text: string,
    comments: commentType[],
    likes: Types.ObjectId[],
    postCreatedAt: Date,
    _id?: Types.ObjectId
}

