    import React, { useState } from 'react';
    import AdminHeader from '../Component/AdminHeader';
    import Firebase from '../Firebase';
    import '../Component/Video.css';

    const UploadVideos = () => {
        const [videoInfo, setVideoInfo] = useState({
            Url: "",
            Category: ""
        });

        const handleInputChange = (event) => {
            setVideoInfo({
                ...videoInfo,
                [event.target.name]: event.target.value
            });
        };

        const extractVideoId = (url) => {
            const match = url.match(/[?&]v=([^&]*)/);
            return match ? match[1] : null;
        };

        const extractVideoIdFromShareLink = (url) => {
            const match = url.match(/youtu\.be\/([^?&]+)/);
            return match ? match[1] : null;
        };

        const handleSave = (event) => {
            event.preventDefault();
            if (videoInfo.Url !== "" && videoInfo.Category !== "") {
                let videoId = extractVideoId(videoInfo.Url);
                if (!videoId) {
                    videoId = extractVideoIdFromShareLink(videoInfo.Url);
                }
                if (videoId) {
                    const videoData = {
                        Url: videoId,
                        Category: videoInfo.Category
                    };
                    Firebase.child("Video").push(videoData)
                        .then(() => {
                            alert("Video information saved successfully!");
                            setVideoInfo({
                                Url: "",
                                Category: ""
                            });
                        })
                        .catch((error) => {
                            alert("Error saving data to Firebase:");
                        });
                } else {
                    alert("Invalid YouTube video URL!");
                }
            } else {
                alert("Fields are empty!");
            }
        };

        return (
            <div>
                <AdminHeader />
                <div className="box">
                    <h7 id="heading" >Enter Your Video Here </h7>
                    <form>
                        <label>Enter video Url</label>
                        <input
                            type="text"
                            name="Url"
                            value={videoInfo.Url}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Enter Video url"
                        />
                        <label>Enter video Category</label>
                        <input
                            type="text"
                            name="Category"
                            value={videoInfo.Category}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Enter Video Category"
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    export default UploadVideos;
