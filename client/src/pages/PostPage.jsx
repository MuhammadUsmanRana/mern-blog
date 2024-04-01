import { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Button, Spinner } from "flowbite-react";
import CallToActon from '../components/CallToActon';
import CommentSection from '../components/CommentSection';


const PostPage = () => {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);

  // const sanitizedContent = DOMPurify.sanitize(post.content);
  const slugPage = useParams();
  // console.log(post)

  useEffect(() => {
    try {
      setLoading(true);
      const fetchPost = async () => {
        const res = await axios.get(`http://localhost:3000/api/post/getposts?slug=${slugPage.postSlug}`);
        // console.log(res.data.posts)
        if (res.data.posts) {
          setPost(res.data.posts[0]);
          setLoading(false);
          setError(null)
        } else {
          setError(true);
          setLoading(false);
          return;
        }
      }

      fetchPost()
    } catch (error) {
      setError(true);
      setLoading(false)
    }
  }, [slugPage])

  if (loading) return (
    <div className='flex justify-center item-center min-h-screen'> <Spinner size="xl" /></div>
  );

  return (
    <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='text-3xl mt-10 p-3 text-center font-serif mx-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
      <Link to={`/search?category=${post && post.category}`} className='self-center mt-5'>
        <Button color='gray' pill sixe='xs'>{post && post.category}</Button>
      </Link>
      <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 w-full object-cover max-h-[600px]' />
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'> {post && (post.content.length / 1000).toFixed(0)} mins read </span>
      </div>
      <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{ __html: post && post.content }}>

      </div>
      <div className='max-w-4xl mx-auto w-full'>
        <CallToActon />
      </div>
      <CommentSection postId={post._id} />
    </main>
  )
}

export default PostPage;