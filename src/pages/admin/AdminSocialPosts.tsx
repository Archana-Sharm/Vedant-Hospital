import {
  useEffect,
  useState,
  type ChangeEvent,
} from 'react';

import { type SocialPost } from '../../data/initialData';
import {
  MedicalIcon,
  iconColor,
} from '../../components/MedicalIcons';

const API_URL = 'http://localhost:5000/api/social-posts';

const empty = (): Omit<SocialPost, 'id'> => ({
  platform: 'facebook',
  postUrl: '',
  embedUrl: '',
  thumbnail: '',
  caption: '',
  date: new Date().toISOString().split('T')[0],
  active: true,
  order: 1,
});

const PLATFORM_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
};

const platformColors: Record<string, string> = {
  facebook: 'bg-blue-100 text-blue-700',
  instagram: 'bg-pink-100 text-pink-700',
  youtube: 'bg-red-100 text-red-700',
};

type MongoSocialPost = {
  _id: string;
  platform: 'facebook' | 'instagram' | 'youtube';
  postUrl: string;
  embedUrl: string;
  thumbnail: string;
  caption: string;
  date: string;
  active: boolean;
  order: number;
};

export default function AdminSocialPosts() {
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<
    false | 'add' | SocialPost
  >(false);

  const [form, setForm] =
    useState<Omit<SocialPost, 'id'>>(empty());

  const [deleteConfirm, setDeleteConfirm] =
    useState<string | null>(null);

  // =========================
  // LOAD POSTS FROM MONGODB
  // =========================

  useEffect(() => {
    const fetchSocialPosts = async () => {
      try {
        setLoading(true);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('Failed to fetch social posts');
        }

        const data: MongoSocialPost[] =
          await response.json();

        const mappedPosts: SocialPost[] = data.map(
          (post) => ({
            id: post._id,
            platform: post.platform,
            postUrl: post.postUrl || '',
            embedUrl: post.embedUrl || '',
            thumbnail: post.thumbnail || '',
            caption: post.caption || '',
            date: post.date || '',
            active: post.active,
            order: post.order,
          })
        );

        setSocialPosts(mappedPosts);
      } catch (error) {
        console.error(
          'Failed to load social posts:',
          error
        );

        alert(
          'Unable to load social posts from the server.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSocialPosts();
  }, []);

  // =========================
  // IMAGE UPLOAD
  // =========================

  const handleThumbnailChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert(
        'Please select an image smaller than 2 MB.'
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      if (typeof imageData === 'string') {
        setForm((previous) => ({
          ...previous,
          thumbnail: imageData,
        }));
      }
    };

    reader.onerror = () => {
      alert('Unable to read the selected image.');
    };

    reader.readAsDataURL(file);
  };

  const removeThumbnail = () => {
    setForm((previous) => ({
      ...previous,
      thumbnail: '',
    }));
  };

  // =========================
  // OPEN ADD
  // =========================

  const openAdd = () => {
    setForm(empty());
    setModal('add');
  };

  // =========================
  // OPEN EDIT
  // =========================

  const openEdit = (post: SocialPost) => {
    setForm({
      platform: post.platform,
      postUrl: post.postUrl,
      embedUrl: post.embedUrl,
      thumbnail: post.thumbnail,
      caption: post.caption,
      date: post.date,
      active: post.active,
      order: post.order,
    });

    setModal(post);
  };

  // =========================
  // SAVE
  // =========================

  const save = async () => {
    if (!form.caption.trim() || !form.platform) {
      alert(
        'Please enter a caption and select a platform.'
      );
      return;
    }

    try {
      // =========================
      // ADD NEW POST
      // =========================

      if (modal === 'add') {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error(
            'Failed to create social post'
          );
        }

        const newPost: MongoSocialPost =
          await response.json();

        const mappedPost: SocialPost = {
          id: newPost._id,
          platform: newPost.platform,
          postUrl: newPost.postUrl || '',
          embedUrl: newPost.embedUrl || '',
          thumbnail: newPost.thumbnail || '',
          caption: newPost.caption || '',
          date: newPost.date || '',
          active: newPost.active,
          order: newPost.order,
        };

        setSocialPosts((previous) => [
          ...previous,
          mappedPost,
        ]);
      }

      // =========================
      // UPDATE EXISTING POST
      // =========================

      else if (modal !== false) {
        const response = await fetch(
          `${API_URL}/${modal.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
          }
        );

        if (!response.ok) {
          throw new Error(
            'Failed to update social post'
          );
        }

        const updatedPost: MongoSocialPost =
          await response.json();

        const mappedPost: SocialPost = {
          id: updatedPost._id,
          platform: updatedPost.platform,
          postUrl: updatedPost.postUrl || '',
          embedUrl: updatedPost.embedUrl || '',
          thumbnail: updatedPost.thumbnail || '',
          caption: updatedPost.caption || '',
          date: updatedPost.date || '',
          active: updatedPost.active,
          order: updatedPost.order,
        };

        setSocialPosts((previous) =>
          previous.map((post) =>
            post.id === modal.id
              ? mappedPost
              : post
          )
        );
      }

      setModal(false);
    } catch (error) {
      console.error(
        'Failed to save social post:',
        error
      );

      alert(
        'Unable to save the social post. Please make sure the backend is running.'
      );
    }
  };

  // =========================
  // TOGGLE ACTIVE
  // =========================

  const toggle = async (id: string) => {
    const post = socialPosts.find(
      (item) => item.id === id
    );

    if (!post) return;

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            active: !post.active,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to update post status'
        );
      }

      const updatedPost: MongoSocialPost =
        await response.json();

      setSocialPosts((previous) =>
        previous.map((item) =>
          item.id === id
            ? {
                ...item,
                active: updatedPost.active,
              }
            : item
        )
      );
    } catch (error) {
      console.error(
        'Failed to toggle social post:',
        error
      );

      alert(
        'Unable to change the post status.'
      );
    }
  };

  // =========================
  // DELETE
  // =========================

  const remove = async (id: string) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error(
          'Failed to delete social post'
        );
      }

      setSocialPosts((previous) =>
        previous.filter((post) => post.id !== id)
      );

      setDeleteConfirm(null);
    } catch (error) {
      console.error(
        'Failed to delete social post:',
        error
      );

      alert(
        'Unable to delete the social post.'
      );
    }
  };

  const sorted = [...socialPosts].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="space-y-5">

      {/* ================= HEADER ================= */}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text">
          Social Media Posts
        </h1>

        <button
          onClick={openAdd}
          className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark"
        >
          + Add Post
        </button>
      </div>

      {/* ================= LOADING ================= */}

      {loading && (
        <div className="bg-white border border-border rounded-xl p-12 text-center text-text-muted">
          Loading social posts...
        </div>
      )}

      {/* ================= POSTS GRID ================= */}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {sorted.map((post) => (
            <div
              key={post.id}
              className={`bg-white border rounded-xl overflow-hidden ${
                post.active
                  ? 'border-border'
                  : 'border-border opacity-60'
              }`}
            >

              {/* Thumbnail */}

              <div className="w-full h-40 bg-muted flex items-center justify-center overflow-hidden">

                {post.thumbnail ? (
                  <img
                    src={post.thumbnail}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <MedicalIcon
                    name="image"
                    size={32}
                    color={iconColor.muted}
                    strokeWidth={2}
                  />
                )}

              </div>

              <div className="p-4">

                {/* Platform + Status */}

                <div className="flex items-center justify-between mb-2">

                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      platformColors[post.platform]
                    }`}
                  >
                    {PLATFORM_LABELS[post.platform]}
                  </span>

                  <span
                    className={`text-xs ${
                      post.active
                        ? 'text-success'
                        : 'text-text-muted'
                    }`}
                  >
                    {post.active
                      ? 'Active'
                      : 'Inactive'}
                  </span>

                </div>

                {/* Caption */}

                <p className="text-sm text-text line-clamp-2 mb-2">
                  {post.caption}
                </p>

                {/* Date */}

                <p className="text-xs text-text-light mb-3">
                  {post.date}
                </p>

                {/* Buttons */}

                <div className="flex gap-2">

                  <button
                    onClick={() => toggle(post.id)}
                    className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${
                      post.active
                        ? 'border-warning text-warning'
                        : 'border-success text-success'
                    }`}
                  >
                    {post.active
                      ? 'Disable'
                      : 'Enable'}
                  </button>

                  <button
                    onClick={() => openEdit(post)}
                    className="flex-1 py-1.5 text-xs text-primary border border-primary rounded-lg"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setDeleteConfirm(post.id)
                    }
                    className="flex-1 py-1.5 text-xs text-danger border border-danger rounded-lg"
                  >
                    Del
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

      {/* ================= EMPTY STATE ================= */}

      {!loading && sorted.length === 0 && (
        <div className="bg-white border border-border rounded-xl p-12 text-center text-text-muted">
          No social posts yet.
        </div>
      )}

      {/* ================= ADD / EDIT MODAL ================= */}

      {modal !== false && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">

            {/* Modal Header */}

            <div className="p-6 border-b border-border flex items-center justify-between">

              <h2 className="font-semibold text-text">
                {modal === 'add'
                  ? 'Add Social Post'
                  : 'Edit Post'}
              </h2>

              <button
                onClick={() => setModal(false)}
                className="p-1 rounded-md hover:bg-muted"
              >
                <MedicalIcon
                  name="x"
                  size={16}
                  color={iconColor.muted}
                  strokeWidth={2.2}
                />
              </button>

            </div>

            {/* Modal Content */}

            <div className="p-6 space-y-4">

              {/* Platform */}

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Platform *
                </label>

                <select
                  value={form.platform}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      platform:
                        event.target.value as SocialPost['platform'],
                    })
                  }
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="facebook">
                    Facebook
                  </option>

                  <option value="instagram">
                    Instagram
                  </option>

                  <option value="youtube">
                    YouTube
                  </option>
                </select>
              </div>

              {/* Post URL */}

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Post URL
                </label>

                <input
                  type="text"
                  value={form.postUrl}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      postUrl:
                        event.target.value,
                    })
                  }
                  placeholder="https://facebook.com/..."
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* YouTube Embed URL */}

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  YouTube Embed URL
                </label>

                <input
                  type="text"
                  value={form.embedUrl}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      embedUrl:
                        event.target.value,
                    })
                  }
                  placeholder="https://youtube.com/embed/..."
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Thumbnail */}

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Post Thumbnail
                </label>

                {form.thumbnail ? (
                  <div className="space-y-3">

                    {/* Preview */}

                    <div className="w-full h-48 rounded-xl overflow-hidden border border-border bg-muted">
                      <img
                        src={form.thumbnail}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Change / Remove */}

                    <div className="flex gap-2">

                      <label className="flex-1 cursor-pointer">

                        <div className="w-full px-4 py-2.5 text-center text-sm font-medium text-primary border border-primary rounded-lg hover:bg-primary/10">
                          Change Image
                        </div>

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={
                            handleThumbnailChange
                          }
                          className="hidden"
                        />

                      </label>

                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="px-4 py-2.5 text-sm text-danger border border-danger rounded-lg hover:bg-danger/10"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                ) : (
                  <label className="block cursor-pointer">

                    <div className="w-full h-36 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center hover:border-primary transition-colors">

                      <MedicalIcon
                        name="image"
                        size={30}
                        color={iconColor.muted}
                        strokeWidth={2}
                      />

                      <span className="text-sm font-medium text-text mt-2">
                        Upload Post Thumbnail
                      </span>

                      <span className="text-xs text-text-muted mt-1">
                        PNG, JPG or WEBP · Max 2 MB
                      </span>

                    </div>

                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={
                        handleThumbnailChange
                      }
                      className="hidden"
                    />

                  </label>
                )}
              </div>

              {/* Date */}

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Date
                </label>

                <input
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      date: event.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Display Order */}

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Display Order
                </label>

                <input
                  type="number"
                  value={form.order}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      order: Number(
                        event.target.value
                      ),
                    })
                  }
                  placeholder="1"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Caption */}

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Caption *
                </label>

                <textarea
                  value={form.caption}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      caption:
                        event.target.value,
                    })
                  }
                  placeholder="Post caption"
                  className="w-full px-3 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none h-24"
                />
              </div>

              {/* Active */}

              <label className="flex items-center gap-3 cursor-pointer">

                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      active:
                        event.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-primary"
                />

                <span className="text-sm font-medium text-text">
                  Active
                </span>

              </label>

            </div>

            {/* Modal Footer */}

            <div className="p-6 border-t border-border flex gap-3 justify-end">

              <button
                onClick={() => setModal(false)}
                className="px-4 py-2 text-sm text-text-muted"
              >
                Cancel
              </button>

              <button
                onClick={save}
                className="px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark"
              >
                Save
              </button>

            </div>

          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION ================= */}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">

            <h3 className="font-semibold mb-2">
              Delete Post?
            </h3>

            <p className="text-sm text-text-muted mb-5">
              This cannot be undone.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() =>
                  setDeleteConfirm(null)
                }
                className="flex-1 py-2.5 border border-border rounded-lg text-sm"
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  remove(deleteConfirm)
                }
                className="flex-1 py-2.5 bg-danger text-white rounded-lg text-sm font-medium"
              >
                Delete
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}