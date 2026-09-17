import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const initialFormState = {
  title: "",
  category: "",
  summary: "",
  content: "",
  author: "Vikas Gowda",
};

const Blog = () => {
  const [form, setForm] = useState(initialFormState);
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

  const fetchPosts = async (category = "All") => {
    setLoadingPosts(true);
    setStatusMessage("");

    try {
      const query =
        category && category !== "All"
          ? `?category=${encodeURIComponent(category)}`
          : "";

      const response = await fetch(`${apiBaseUrl}/api/blogs${query}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not fetch blog posts.");
      }

      setPosts(data.posts || []);
      setSelectedCategory(category);
    } catch (error) {
      console.error(error);
      setStatusMessage(error.message || "Could not fetch posts right now.");
    } finally {
      setLoadingPosts(false);
    }
  };

  React.useEffect(() => {
    fetchPosts("All");
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(posts.map((post) => post.category.trim()))];
    return ["All", ...uniqueCategories];
  }, [posts]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePublishPost = async (event) => {
    event.preventDefault();
    setPublishing(true);
    setStatusMessage("");

    try {
      const response = await fetch(`${apiBaseUrl}/api/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Could not publish post.");
      }

      setForm(initialFormState);
      setStatusMessage("Blog post published.");
      await fetchPosts(selectedCategory);
    } catch (error) {
      console.error(error);
      setStatusMessage(error.message || "Publishing failed. Please try again.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Write and share ideas</p>
        <h2 className={styles.sectionHeadText}>Blog.</h2>
      </motion.div>

      <div className='mt-12 grid xl:grid-cols-2 grid-cols-1 gap-8'>
        <motion.div
          variants={fadeIn("right", "spring", 0.2, 1)}
          className='bg-black-100 rounded-2xl p-8'
        >
          <h3 className='text-white text-[24px] font-bold'>Publish a post</h3>
          <p className='text-secondary mt-2'>Create posts under categories for visitors to read.</p>

          <form onSubmit={handlePublishPost} className='mt-8 flex flex-col gap-5'>
            <input
              type='text'
              name='title'
              value={form.title}
              onChange={handleInputChange}
              required
              placeholder='Post title'
              className='bg-tertiary py-3 px-5 text-white rounded-lg outline-none border-none'
            />
            <input
              type='text'
              name='category'
              value={form.category}
              onChange={handleInputChange}
              required
              placeholder='Category (e.g. React, Node, DevOps)'
              className='bg-tertiary py-3 px-5 text-white rounded-lg outline-none border-none'
            />
            <input
              type='text'
              name='summary'
              value={form.summary}
              onChange={handleInputChange}
              required
              placeholder='Short summary'
              className='bg-tertiary py-3 px-5 text-white rounded-lg outline-none border-none'
            />
            <input
              type='text'
              name='author'
              value={form.author}
              onChange={handleInputChange}
              required
              placeholder='Author name'
              className='bg-tertiary py-3 px-5 text-white rounded-lg outline-none border-none'
            />
            <textarea
              rows={8}
              name='content'
              value={form.content}
              onChange={handleInputChange}
              required
              placeholder='Write the full blog content...'
              className='bg-tertiary py-3 px-5 text-white rounded-lg outline-none border-none'
            />

            <button
              type='submit'
              disabled={publishing}
              className='bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary disabled:opacity-70'
            >
              {publishing ? "Publishing..." : "Publish"}
            </button>
          </form>

          {statusMessage && <p className='text-secondary mt-4'>{statusMessage}</p>}
        </motion.div>

        <motion.div
          variants={fadeIn("left", "spring", 0.25, 1)}
          className='bg-black-100 rounded-2xl p-8'
        >
          <div className='flex items-center justify-between gap-4 flex-wrap'>
            <h3 className='text-white text-[24px] font-bold'>Latest posts</h3>
            <button
              type='button'
              onClick={() => fetchPosts(selectedCategory)}
              className='text-secondary hover:text-white transition-colors text-sm'
            >
              Refresh
            </button>
          </div>

          <div className='mt-6 flex flex-wrap gap-3'>
            {categories.map((category) => (
              <button
                key={category}
                type='button'
                onClick={() => fetchPosts(category)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-white text-black"
                    : "bg-tertiary text-secondary hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className='mt-8 space-y-5 max-h-[560px] overflow-y-auto pr-1'>
            {loadingPosts && <p className='text-secondary'>Loading posts...</p>}

            {!loadingPosts && posts.length === 0 && (
              <p className='text-secondary'>No posts yet in this category.</p>
            )}

            {!loadingPosts &&
              posts.map((post) => (
                <article key={post._id} className='bg-tertiary rounded-xl p-5'>
                  <div className='flex items-center justify-between gap-3 flex-wrap'>
                    <span className='text-xs uppercase tracking-wider text-secondary'>
                      {post.category}
                    </span>
                    <span className='text-xs text-secondary'>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className='text-white font-semibold text-[20px] mt-2'>{post.title}</h4>
                  <p className='text-secondary mt-2'>{post.summary}</p>
                  <p className='text-white/90 mt-3 whitespace-pre-wrap'>{post.content}</p>
                  <p className='text-secondary mt-4 text-sm'>By {post.author}</p>
                </article>
              ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SectionWrapper(Blog, "blog");
