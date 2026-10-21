import React, { useState, useEffect } from 'react';
import {
  Member,
  Post,
  Comment,
  BlogCategory,
  ForumCategory,
  parseCSVData,
  transformMembers,
  transformPosts,
  transformComments,
  transformBlogCategories,
  transformForumCategories
} from '../services/dataImportService';

// Mock data that would normally be loaded from CSV files
const MOCK_MEMBERS_CSV = `"Login Email","Privacy Status","ID","Creation Date","About (Plain Text)","Profile Photo","checkInId","About (Rich Text)","Last Updated","Slug","Last Name","First Name","Birthdate","Activity Status","Last Login Date","Position","Status","Contact Id","Cover Photo","Verified Member Pin","Company","Phone","Nickname"
"mustybash@icloud.com","PUBLIC","009f1704-f510-4a46-82e9-99abcc10eabd","2024-07-,
06T13:,
00:45Z","",",
https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=7513785852052368&height=200&width=200&ext=1722862841&hash=AbYupVY_uOvjyX49uc9gfGt8","","","2024-07-,
06T13:,
00:45Z","mustybash","Basheer","Mustapha","","ACTIVE","2024-07-,
06T13:,
00:46Z","","APPROVED","009f1704-f510-4a46-82e9-99abcc10eabd","","","","Mustapha Basheer"
"amalabbakar@gmail.com","PUBLIC","0120b016-28c4-4d38-8025-3cf0ea1ae835","2024-07-,
24T17:,
31:54Z","",",
https://lh3.googlemembercontent.com/a/ACg8ocLS7L5phiSgg_iYhteBV6jK_UggWoZuFUJHNajVXopxaS0lTg=s96-c","","","2024-07-,
24T17:,
31:54Z","amalabbakar","abbakar","amal","","ACTIVE","2024-07-,
24T17:,
31:57Z","","APPROVED","0120b016-28c4-4d38-8025-3cf0ea1ae835","","","","amal abbakar"`;

const MOCK_POSTS_CSV = '"Best Answer Comment ID","Category ID","View Count","Edited Date","ID","Page URL","Created date","Owner ID","Slug","Plain Content","Commenting Disabled","Last Activity Date","Comment Count","Pinned","Title","Comment Interaction","Like Count"';

const MOCK_COMMENTS_CSV = '"Downvote Count","Edited Date","ID","Reply Count","Page URL","Created date","Owner ID","Score","Plain Content","Last Activity Date","Upvote Count","Post ID","Parent ID","Like Count"';

const MOCK_BLOG_CATEGORIES_CSV = `"Post Count","Category Page URL","Posts","Description","ID","Label","Translation ID","Slug","Category Page Slug","Cover Image","Language"
1,"/blog/categories/lifestyles","[""65b2320d02dcae0b2123d51e""]","","65b2328df5cebb7ba4c6b77f","Lifestyles","","lifestyles","/categories/lifestyles","","en"
0,"/blog/categories/gossip-lifestyle-and-media","","Celebrity Gossip Lifestyle and Media","645cea9a236b6bc2e2b370bc","Gossip Lifestyle and Media","","gossip-lifestyle-and-media","/categories/gossip-lifestyle-and-media",",
https://cdn.fingermobileprotocol.com/media/9a1209_cc0c360594fe481b9fab2001fb8be31a~mv2.jpg","en"`;

const MOCK_FORUM_CATEGORIES_CSV = `"Write Protected","Post Count","Header Text Color","Name","Description","Header Type","ID","Page URL","Rank","Header Background Color","Slug","Post View Count","Header Image Overlay Color","Header Image","Parent ID","Header Title"
false,752,"{""color"":""#FFFFFF"",""opacity"":1}","General Discussion","Share your stories, ideas, pictures, videos and a lot more!
Explore your Creativity.","IMAGE","638f7ece81ba080012b79320","/news-feed/general-discussion",0,"{""color"":""#FFFFFF"",""opacity"":1}","general-discussion",3523,"{""color"":""#000000"",""opacity"":0}",",
https://cdn.fingermobileprotocol.com/media/9a1209_ee5c0ff4ef7444f4ae3ec3f73bec51e7~mv2.jpg","","Leadership Tips"
false,79,"{""color"":""#FFFFFF"",""opacity"":1}","Questions & Answers","A talk, especially an informal one, between two or more people, in which news and ideas. Get answers and share knowledge","IMAGE","638f7ece81ba080012b79321","/news-feed/questions-answers",1,"{""color"":""#FFFFFF"",""opacity"":1}","questions-answers",386,"{""color"":""#000000"",""opacity"":0}",",
https://cdn.fingermobileprotocol.com/media/9a1209_982e86bab7604f059c720cff2085e136~mv2.jpg","","Questions & Answers"`;

interface ImportedData {members: Member[];
  posts: Post[];
  comments: Comment[];
  blogCategories: BlogCategory[];
  forumCategories: ForumCategory[];
}

export const useImportedData = () => {
  const [data, setData] = React.useState<ImportedData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // In a real implementation, we would fetch the actual CSV files
        // For now, we're using mock data to demonstrate the functionality

        const members = parseCSVData<Member>(
          MOCK_MEMBERS_CSV,
          transformMembers,
        );
        const posts = parseCSVData<Post>(MOCK_POSTS_CSV, transformPosts);
        const comments = parseCSVData<Comment>(
          MOCK_COMMENTS_CSV,
          transformComments,
        );
        const blogCategories = parseCSVData<BlogCategory>(
          MOCK_BLOG_CATEGORIES_CSV,
          transformBlogCategories,
        );
        const forumCategories = parseCSVData<ForumCategory>(
          MOCK_FORUM_CATEGORIES_CSV,
          transformForumCategories,
        );

        setData({
          members,
          posts,
          comments,
          blogCategories,
          forumCategories
        });

        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
        console.error('Error loading data:', err);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};
