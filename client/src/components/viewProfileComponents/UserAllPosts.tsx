import React, { useContext, useState, useEffect } from 'react';
import { postType } from '../../../../server/types/postType';

import SinglePostComponent from '../postComponents/SinglePostComponent';
import { UserContext } from '../../hooks/UserContextHook';
import { getAllPosts } from '../../api/postAPIs/getAllPostsApi';

const UserAllPosts: React.FC = () => {
    // Get currentUserData from Context Provider
    const { targetUser } = useContext(UserContext);
    const [userPosts, setUserPosts] = useState<postType[]>([]);


    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const posts: postType[] = await getAllPosts();
                // Filter and reverse, reverse is for showing latest posts first
                const filteredPosts = posts.filter(post => post.creator._id === targetUser._id).reverse()
                setUserPosts(filteredPosts)

            }
            catch (error) {
                console.error("Error occured while fetching all posts from DB: " + error)
            }
        }
        fetchPosts()
    }, [targetUser._id]);

    return (
        <div className="my-12 grid place-items-center gap-20">
            {userPosts.map((post: postType, index: number) => (
                <div key={index}>
                    <SinglePostComponent post={post} />
                </div>
            ))}
        </div>
    );
};

export default UserAllPosts;


