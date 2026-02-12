

<div align="center">
<a href="https://github.com/KevinJPC/JamAI" target="blank">
    <img src="./assets/icon.png" width="50" alt="Logo" />
</a>

<h2>JamAI - AI-powered YouTube chords extractor</h2>

<a href="https://youtu.be/kZkiYJ2R8tY" target="_blank" rel="noopener noreferrer" title="JamAI Demo">
   <img src ="https://i.ytimg.com/vi/kZkiYJ2R8tY/maxresdefault.jpg" width="80%" alt="JamAI demo thumbnail">
</a>
<br>
<a href="https://youtu.be/kZkiYJ2R8tY" target="_blank" rel="noopener noreferrer">▶️ Video Demo</a> 
|
<a href="https://lively-bush-0824cc10f.2.azurestaticapps.net target="_blank" rel="noopener noreferrer"">🔗Live Demo</a>
</div>

## 💡 Overview

JamAI is an AI-powered chord extractor for YouTube songs with synchronized playback. It allows you to search and analyze any song to retrieve its bpm, key, beats, and chords. Once analyzed, you can play the song with real-time highlighting of the current beat and chord, allowing you to seamlessly play along with it.

As a hobbyist pianist I often find myself using chord extractor services to help me learn new songs. Since I was really curious about how this services worked I wanted to create a simplified version myself. 

Even though there are songs where the generated results are actually good, most of them are not 100% perfect. However, after playing some of those songs that I didn't know, it actually helped me a lot since it provided a good enough base that I could use to figure out the rest of the chords. 

With that being said, there are some genres or too quiet songs where the provided results are not really helpful. 

## ✨ Features

- **▶️YouTube Integration**: Search any song from YouTube.
- **🔍Song analysis**: Analyze a song to retrieve its bpm, key, beats and chords.
- **⏩Syncronized playback**: Play along with real-time highliting of the current beat and chord. You can jump back and forward to the beat you want.
- **⚙️ Chords and playback customization:** Simplify and transpose the chords, toggle the chords accidental (Flat or sharp), aswell as its notation system (English or Latin). Turn up/down the playback volume and turn on/off auto-scroll.
- **🔐 User Authentication:** Email and password based authentication.
- **✏️ Creation of song's versions:** Base on a song version create your own with improved chords. Shift the chords within the view, change the time signature, delete and/or edit the chords.
- **❤️ Favorite songs and rate versions:** Favorite the songs you like to access them later in your favorite list, and rate song versions to let other people known the quality of it.
- **📱 Responsive Design:** Fully responsive interface that works on all screen sizes.

## 👩‍💻 Tech Stack
- [**Madmon**](https://github.com/CPJKU/madmom): Python audio and music signal processing library.
- [**Crema**](https://github.com/bmcfee/crema): Convolutional and recurrent estimators for music analysis.
- **[React.js](https://react.dev/)**: JavaScript library for building user interfaces.
- **[Tanstack Query](https://tanstack.com/query/v5)**: Asynchronous state management, server-state utilities and data fetching.
- **[Express.js](https://expressjs.com/)**: Minimalist web framework for Node.js
- **[Redis](https://redis.io/)**: In-memory key–value database. 
- **[BullMQ](https://bullmq.io/)**: Message queue for Redis™.
- **[MongoDB](https://www.mongodb.com/)**: NoSQL database designed for high performance, scalability, and flexibility

## 📖 Sources and external API's

- [YouTube Data API](https://developers.google.com/youtube/v3/getting-started) for searching music videos

## 📦 Getting Started

To get a local copy of this project up and running, follow these steps.

### 🚀 Prerequisites

- **Linux** or **WSL** if you are in Windows (some specific and required versions of python dependencies are not available for Windows and its installation will fail)
- **Node.js** (v22.x or higher) and **Npm** (since the project uses npm workspaces).
- **Python** (v3.11.x)
- **ffmpeg**
- **MongoDB**
- **Redis**

## 🛠️ Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/KevinJPC/JamAI.git
   cd JamAI
   ```

2. **Install dependencies:**

   For all workspaces dependencies installation run:

   ```bash
   npm install
   ```

   For the Python Analyzer API do the following:
   - ``cd`` into ``packages/analyzer-api/``
   - Create and activate virtual enviroment with the following commands:
   
      ```bash
        python -m venv .venv
        source .venv/bin/activate
      ```
   - Install ```pip-tools``` to manage the python dependencies and install them using the following commands:
      
      ```bash
        pip install pip-tools
        pip-sync
      ```

3. **Databases setup**

   Spin up your MongoDB and Redis instance, optionally for development **you can use the provided docker compose file** in the root of the project with the following command, assumming you already got docker installed.

   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```

3. **Set up environment variables:**

   **Root Environment**: Create a ```.env``` file in the root directory. Copy the variables from ```.env.example```, paste them into your new ```.env``` file, and populate the values.

   **Analyzer API Environment**: Navigate to the ```/packages/analyzer-api```folder. Copy the variables from ```.env.example``` to a new ```.env``` file and populate the values.

4. **Run database migrations:**

   Ensure your MongoDB instance is up and then run:

   ```bash
   npm run db-migrations migrate:dev
   ```

5. **Start the development servers:**
   - **API (and analyses worker):** ``npm run api dev``
   - **Frontend app:** ``npm run app dev``
   - **Analyzer API Service:** From ``/packages/analyzer-api`` folder and within the virtual enviroment run ``flask --app src/main.py run``

## 📜 License

Distributed under the MIT License. See [License](/LICENSE) for more information.
