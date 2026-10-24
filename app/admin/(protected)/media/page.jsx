'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  UploadCloud,
  Cloud,
  AlertCircle,
  FolderOpen,
  Video,
  Play,
  Youtube,
  CheckCircle2,
  Clock,
  Info,
  Loader2,
  X,
} from 'lucide-react';
import { useVideoStore } from '@/store/useVideoStore';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

function getYouTubeId(url = '') {
  const match = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/|live\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

export default function AdminMediaPage() {
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' or 'images'

  // Image Media State
  const [media, setMedia] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(true);
  const [showAddImage, setShowAddImage] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [uploadMode, setUploadMode] = useState('file'); // 'file' or 'url'
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageErrorMsg, setImageErrorMsg] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const fileInputRef = useRef(null);

  const [newImage, setNewImage] = useState({
    filename: '',
    url: '',
    file: '',
    altText: '',
    category: 'general',
  });

  // YouTube Videos State (Managed via Zustand + Axios)
  const {
    videos,
    isLoading: loadingVideos,
    isSaving: savingVideo,
    isDeleting: deletingVideo,
    error: videoError,
    success: videoSuccess,
    fetchVideos,
    createVideo,
    deleteVideo,
    clearMessages,
  } = useVideoStore();

  const [showAddVideo, setShowAddVideo] = useState(false);
  const [videoFormError, setVideoFormError] = useState('');
  const [newVideo, setNewVideo] = useState({
    title: '',
    videoUrl: '',
    description: '',
    duration: '',
  });

  // Delete Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, name, type: 'video' | 'image' }
  const [isDeletingTarget, setIsDeletingTarget] = useState(false);

  // Fetch image media assets
  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/v1/admin/media');
      const json = await res.json();
      if (json.success) setMedia(json.data || []);
    } finally {
      setLoadingMedia(false);
    }
  };

  useEffect(() => {
    fetchMedia();
    fetchVideos(true);
  }, [fetchVideos]);

  // Detected YouTube ID for live preview in modal
  const detectedYtId = useMemo(() => getYouTubeId(newVideo.videoUrl), [newVideo.videoUrl]);
  const liveVideoThumbnail = detectedYtId ? `https://i.ytimg.com/vi/${detectedYtId}/hqdefault.jpg` : '';

  /* ---------------- YouTube Video Handlers ---------------- */

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setVideoFormError('');
    clearMessages();

    if (videos.length >= 4) {
      setVideoFormError('Maximum 4 videos limit reached. Please delete an existing video first.');
      return;
    }

    if (!newVideo.videoUrl.trim()) {
      setVideoFormError('Please enter a YouTube video URL.');
      return;
    }

    if (!detectedYtId && !newVideo.videoUrl.includes('youtube.com') && !newVideo.videoUrl.includes('youtu.be')) {
      setVideoFormError('Please enter a valid YouTube video link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...).');
      return;
    }

    if (!newVideo.title.trim()) {
      setVideoFormError('Please enter a video title.');
      return;
    }

    try {
      await createVideo({
        title: newVideo.title.trim(),
        videoUrl: newVideo.videoUrl.trim(),
        description: newVideo.description.trim(),
        duration: newVideo.duration.trim(),
        thumbnailUrl: liveVideoThumbnail,
        displayOrder: videos.length,
      });

      setShowAddVideo(false);
      setNewVideo({ title: '', videoUrl: '', description: '', duration: '' });
    } catch (err) {
      setVideoFormError(err.message || 'Failed to save video.');
    }
  };

  const handleDeleteVideo = (id, title) => {
    setDeleteTarget({ id, name: title, type: 'video' });
  };

  const handleDeleteImage = (id, filename) => {
    setDeleteTarget({ id, name: filename || 'Media asset', type: 'image' });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeletingTarget(true);
    clearMessages();
    try {
      if (deleteTarget.type === 'video') {
        await deleteVideo(deleteTarget.id);
      } else {
        await fetch(`/api/v1/admin/media?id=${deleteTarget.id}`, { method: 'DELETE' });
        fetchMedia();
      }
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message || 'Error deleting item');
    } finally {
      setIsDeletingTarget(false);
    }
  };

  /* ---------------- Image Media Handlers ---------------- */

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageErrorMsg('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }

    setImageErrorMsg('');
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImageUrl(reader.result);
      setNewImage((prev) => ({
        ...prev,
        file: reader.result,
        filename: file.name.replace(/\.[^/.]+$/, ''),
        altText: file.name.replace(/\.[^/.]+$/, ''),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleImageUploadSubmit = async (e) => {
    e.preventDefault();
    setImageErrorMsg('');

    if (uploadMode === 'file' && !newImage.file) {
      setImageErrorMsg('Please choose an image file to upload.');
      return;
    }

    if (uploadMode === 'url' && (!newImage.url || !newImage.filename)) {
      setImageErrorMsg('Please provide both the image URL and a label/filename.');
      return;
    }

    setUploadingImage(true);

    try {
      const res = await fetch('/api/v1/admin/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newImage),
      });

      const data = await res.json();
      if (data.success) {
        setShowAddImage(false);
        setNewImage({ filename: '', url: '', file: '', altText: '', category: 'general' });
        setPreviewImageUrl('');
        fetchMedia();
      } else {
        setImageErrorMsg(data.message || 'Failed to upload media.');
      }
    } catch {
      setImageErrorMsg('Network error while communicating with upload server.');
    } finally {
      setUploadingImage(false);
    }
  };


  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const isVideoLimitReached = videos.length >= 4;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-[#10243A]">Media Library</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              <Cloud className="w-3 h-3" /> Cloudinary Ready
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your homepage YouTube video showcase across the Finasset website.
          </p>
        </div>

        {/* Action Button depending on Active Tab */}
        {activeTab === 'videos' ? (
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                isVideoLimitReached
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
              }`}
            >
              {videos.length} / 4 Videos Used
            </span>
            <button
              onClick={() => {
                setShowAddVideo(!showAddVideo);
                setVideoFormError('');
                clearMessages();
              }}
              disabled={isVideoLimitReached}
              title={
                isVideoLimitReached
                  ? 'Maximum limit of 4 videos reached. Delete an existing video to upload another.'
                  : 'Upload YouTube Video Link'
              }
              className={`text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow ${
                isVideoLimitReached
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-[#f87b1f] hover:bg-[#d9620b] text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Upload Video</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              setShowAddImage(!showAddImage);
              setImageErrorMsg('');
            }}
            className="bg-[#10243A] hover:bg-[#1b3858] text-white text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all flex items-center gap-2 shadow"
          >
            <Plus className="w-4 h-4 text-[#C7A76C]" />
            <span>Upload Image</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => {
            setActiveTab('videos');
            clearMessages();
          }}
          className={`flex items-center gap-2 pb-3.5 px-4 text-xs font-bold transition-all border-b-2 -mb-px ${
            activeTab === 'videos'
              ? 'border-[#f87b1f] text-[#f87b1f]'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Youtube className="w-4 h-4 text-rose-500" />
          <span>YouTube Video Showcase</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              isVideoLimitReached
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            {videos.length}/4
          </span>
        </button>

      </div>

      {/* Global Alerts for Video Operations */}
      {videoSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{videoSuccess}</span>
          </div>
          <button onClick={clearMessages} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {videoError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{videoError}</span>
          </div>
          <button onClick={clearMessages} className="text-rose-600 hover:text-rose-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: YOUTUBE VIDEO SHOWCASE (MAX 4 VIDEOS)                   */}
      {/* ============================================================== */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          {/* Max 4 Notice Banner when full */}
          {isVideoLimitReached && !showAddVideo && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800">
                <span className="font-bold block text-sm mb-0.5 text-amber-900">
                  Maximum 4 Video Slots Active
                </span>
                You have reached the maximum allowed limit of 4 YouTube videos for the homepage Video
                Showcase. To upload a new video, please delete or replace one of the existing videos
                below.
              </div>
            </div>
          )}

          {/* Add Video Drawer / Form */}
          {showAddVideo && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-[#10243A] text-base flex items-center gap-2">
                    <Youtube className="w-5 h-5 text-rose-500" />
                    Upload YouTube Showcase Video
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Slot {videos.length + 1} of 4 &bull; This video will appear in the homepage Video Showcase playlist.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddVideo(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {videoFormError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{videoFormError}</span>
                </div>
              )}

              <form onSubmit={handleVideoSubmit} className="space-y-5">
                {/* YouTube Link with live preview */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    YouTube Video URL <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      value={newVideo.videoUrl}
                      onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                      className="w-full text-xs p-3.5 pl-10 border border-slate-200 rounded-xl focus:border-[#f87b1f] focus:ring-4 focus:ring-[#f87b1f]/10 outline-none"
                      required
                    />
                    <Youtube className="w-4 h-4 text-rose-500 absolute left-3.5 top-3.5 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Accepts standard watch links, youtu.be short links, embed links, or YouTube shorts.
                  </p>

                  {/* Live Thumbnail Preview */}
                  {detectedYtId && (
                    <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-4">
                      <div className="relative aspect-video w-32 shrink-0 rounded-lg overflow-hidden bg-black shadow-sm border border-slate-300">
                        <img
                          src={liveVideoThumbnail}
                          alt="YouTube Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Play className="w-5 h-5 fill-white text-white drop-shadow" />
                        </div>
                      </div>
                      <div className="text-xs">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Valid YouTube ID: {detectedYtId}
                        </span>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Thumbnail will be automatically saved from YouTube high-quality assets.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Video Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. The Power of Compounding & Wealth Creation"
                      value={newVideo.title}
                      onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                      className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#f87b1f] focus:ring-4 focus:ring-[#f87b1f]/10 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                      Duration (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 5:20 or 8 min"
                      value={newVideo.duration}
                      onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                      className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#f87b1f] focus:ring-4 focus:ring-[#f87b1f]/10 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Description / Summary (optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short practical guide for investors on long-term capital compounding..."
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:border-[#f87b1f] focus:ring-4 focus:ring-[#f87b1f]/10 outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddVideo(false)}
                    className="px-4 py-2.5 text-xs text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingVideo}
                    className="bg-[#f87b1f] hover:bg-[#d9620b] text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow disabled:opacity-50 flex items-center gap-2"
                  >
                    {savingVideo ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Video...</span>
                      </>
                    ) : (
                      <span>Save YouTube Video</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Videos Grid */}
          {loadingVideos ? (
            <div className="text-center py-16 text-slate-400 text-xs font-bold">
              Loading YouTube videos...
            </div>
          ) : videos.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
                <Youtube className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-[#10243A]">No YouTube Videos Added Yet</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Add up to 4 YouTube video links to showcase practical financial guides and wealth advice on your homepage.
              </p>
              <button
                onClick={() => setShowAddVideo(true)}
                className="mt-6 bg-[#f87b1f] hover:bg-[#d9620b] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Upload First Video (Slot 1 of 4)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((vid, index) => {
                const ytId = getYouTubeId(vid.videoUrl);
                const thumb =
                  vid.thumbnailUrl ||
                  (ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : '');

                return (
                  <div
                    key={vid._id || index}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Video Thumbnail */}
                      <div className="relative aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={vid.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <Video className="w-8 h-8 text-white/30" />
                        )}

                        <span className="absolute top-2 left-2 bg-[#10243A]/85 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          Slot {index + 1} of 4
                        </span>

                        {vid.duration && (
                          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" /> {vid.duration}
                          </span>
                        )}

                        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-[#f87b1f] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </span>
                      </div>

                      <div className="p-4">
                        <h4 className="text-xs font-bold text-[#10243A] line-clamp-2 leading-snug" title={vid.title}>
                          {vid.title}
                        </h4>
                        {vid.description && (
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                            {vid.description}
                          </p>
                        )}
                        <a
                          href={vid.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2.5 inline-flex items-center gap-1 text-[11px] text-[#2376b8] font-semibold hover:underline truncate max-w-full"
                          title={vid.videoUrl}
                        >
                          <Youtube className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{vid.videoUrl}</span>
                        </a>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500">
                      <a
                        href={vid.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-[#2376b8] hover:underline flex items-center gap-1"
                      >
                        <span>Watch on YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <button
                        onClick={() => handleDeleteVideo(vid._id, vid.title)}
                        disabled={deletingVideo}
                        className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete video link"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400 hover:text-rose-600" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Show empty slot cards if under 4 videos */}
              {Array.from({ length: 4 - videos.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  onClick={() => {
                    setShowAddVideo(true);
                    setVideoFormError('');
                  }}
                  className="rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#f87b1f] p-6 text-center flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50/50 hover:bg-[#f87b1f]/5 min-h-[220px]"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-600">Available Slot {videos.length + i + 1} of 4</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click to upload YouTube link</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => !isDeletingTarget && setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === 'video' ? 'Delete Video' : 'Delete Media Asset'}
        itemName={deleteTarget?.name}
        warningDetails={
          deleteTarget?.type === 'video'
            ? 'This video slot will be freed up and removed from the homepage Video Showcase.'
            : 'This will permanently remove the media asset and delete it from Cloudinary.'
        }
        isDeleting={isDeletingTarget}
      />
    </div>
  );
}
