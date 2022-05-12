<template>
  <div>
    <div class="audio-player">
      <div class="dot"></div>
      <div class="controls">
        <div class="time">
          0:00
        </div>
        <div class="timeline">
          <div class="progress"></div>
          <div class="track" @mousedown="startDrag"></div>
        </div>
        <div class="speed-container">
          <div @click="() => changeSpeed(1.5)" class="toggle-speed" :class="{ 'toggle-speed_active': playerSpeed === 1.5 }">x1.5</div>
          <div @click="() => changeSpeed(2)" class="toggle-speed" :class="{ 'toggle-speed_active': playerSpeed === 2 }">x2</div>
        </div>
        <div class="play-container">
          <div class="toggle-play play" ref="playBtn">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UAudioPlayer',
  props: {
    value: {
      type: String,
    }
  },
  data: () => ({
    dragging: false,
    audio: null,
    audioPlayer: null,
    timeToSeek: null,
    refreshTimelineInterval: null,
    playerSpeed: 1
  }),
  methods: {
    changeSpeed(val){
      if(this.audio.playbackRate === val)
        this.audio.playbackRate = 1;
      else
        this.audio.playbackRate = val;

      this.playerSpeed = this.audio.playbackRate;
    },
    startDrag() {
      this.dragging = true;
      clearInterval(this.refreshTimelineInterval);
    },
    stopDrag() {
      if(!this.dragging) return;

      this.audio.currentTime = this.timeToSeek;
      this.dragging = false;
      this.refreshTimeline();
    },
    doDrag(event) {
      if (this.dragging) {
        const audioPlayer = document.querySelector(".audio-player");
        const timeline = audioPlayer.querySelector(".timeline");
        let diff = event.pageX - timeline.offsetLeft;
        const timelineWidth = parseInt(window.getComputedStyle(timeline).width);
        diff = diff < 0 ? 0 : diff > timelineWidth ? timelineWidth : diff;

        this.timeToSeek = diff / timelineWidth * this.audio.duration;
        // this.audio.currentTime = timeToSeek;

        const progressBar = audioPlayer.querySelector(".progress");
        const track = audioPlayer.querySelector(".track");
        progressBar.style.width = this.timeToSeek / this.audio.duration * 100 + "%";
        track.style.left = this.timeToSeek / this.audio.duration * 100 + "%";
        this.audioPlayer.querySelector(".time").textContent = this.getTimeCodeFromNum(this.timeToSeek);
      }
    },
    refreshTimeline(){
      clearInterval(this.refreshTimelineInterval);
      this.refreshTimelineInterval = setInterval(() => {


        const progressBar = this.audioPlayer.querySelector(".progress");
        const track = this.audioPlayer.querySelector(".track");
        let currentTime = 0;
        if(this.audio !== null){
          currentTime = this.audio.currentTime;
        }

        if(this.audio !== null){
          progressBar.style.width = currentTime / this.audio.duration * 100 + "%";
          track.style.left = currentTime / this.audio.duration * 100 + "%";
          this.audioPlayer.querySelector(".time").textContent = this.getTimeCodeFromNum(currentTime);
        }

      }, 100);
    },
    getTimeCodeFromNum(num){
      let seconds = parseInt(num);
      let minutes = parseInt(seconds / 60);
      seconds -= minutes * 60;
      const hours = parseInt(minutes / 60);
      minutes -= hours * 60;

      if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
      return `${String(hours).padStart(2, 0)}:${minutes}:${String(
          seconds % 60
      ).padStart(2, 0)}`;
    },
    initAudio(url){
      this.refreshTimeline();
      this.audio = new Audio(url);
      this.audio.addEventListener(
        "loadeddata",
        () => {
          this.audioPlayer.querySelector(".time").textContent = this.getTimeCodeFromNum(this.audio.duration);
          this.audio.volume = .75;
        }
      );
      this.audio.addEventListener('ended', () =>{
        this.$refs.playBtn.classList.remove("pause");
        this.$refs.playBtn.classList.add("play");
      });
    }
  },
  watch: {
    value(newValue) {
      if(this.audio !== null && !this.audio.paused ){
        this.audio.pause();
        this.$refs.playBtn.classList.remove("pause");
        this.$refs.playBtn.classList.add("play");
      }
      this.initAudio(newValue);
    }
  },
  mounted() {
    this.refreshTimeline();
    window.addEventListener('mouseup', this.stopDrag);
    window.addEventListener('mousemove', this.doDrag);
    const audioPlayer = document.querySelector(".audio-player");
    this.audioPlayer = audioPlayer;
    this.initAudio(this.value);

    const timeline = audioPlayer.querySelector(".timeline");
    timeline.addEventListener("click", e => {
      const clickTargetClassList = e.path[0].classList;
      const isTimeline = clickTargetClassList.contains('timeline') || clickTargetClassList.contains('progress');
      if(!isTimeline) return;
      const timelineWidth = window.getComputedStyle(timeline).width;
      const timeToSeek = e.offsetX / parseInt(timelineWidth) * this.audio.duration;

      this.audio.currentTime = timeToSeek;
    });



    // const playBtn = audioPlayer.querySelector(".controls .toggle-play");
    this.$refs.playBtn.addEventListener(
        "click",
        () => {
          if(this.audio !== null){
            if (this.audio.paused) {
              this.$refs.playBtn.classList.remove("play");
              this.$refs.playBtn.classList.add("pause");
              this.audio.play();
            } else {
              this.$refs.playBtn.classList.remove("pause");
              this.$refs.playBtn.classList.add("play");
              this.audio.pause();
            }
          }
        },
        false
    );
  },
  beforeDestroy() {
    this.audio.pause();
  }
};
</script>

<style lang="scss" scoped>
@import '@/styles/vars';
@import '@/styles/mixins';

.audio-player {
  height: 70px;
  width: 514px;
  background: $clr-blue;
  border-radius: 67px;
  display: flex;
  align-items: center;
  color: white;
  overflow: hidden;
  padding: 0 54px 0 36px;
  user-select: none;

  .timeline {
    background: change-color(white, $alpha: 0.2);
    width: 235px;
    height: 4px;
    position: relative;
    cursor: pointer;
    border-radius: 8px;
    display: flex;
    align-items: center;
    margin: 0 12px 0 20px;
    .progress {
      background: white;
      width: 0;
      height: 100%;
      //transition: 0.1s;
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 8px;
    }
    .track{
      display: block;
      width: 20px;
      height: 20px;
      background-color: white;
      position: absolute;
      //transition: .1s;
      top: 50%;
      left: 0;
      transform: translate(-10px, -50%);
      border-radius: 50%;
    }
  }
  .dot{
    width: 6px;
    height: 6px;
    background-color: #fff;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .speed-container{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 20px 0 8px;
  }
  .toggle-speed{
    font-size: 14px;
    font-weight: 400;
    opacity: .7;
    transition: opacity .3s ease-in-out;
    cursor: pointer;
    &:first-child{
      margin-bottom: 5px;
    }
    &_active{
      font-weight: 500;
      opacity: 1;
    }
  }

  .controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;

    > * {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .toggle-play {
      &.play {
        cursor: pointer;
        position: relative;
        left: 0;
        height: 39px;
        width: 30px;
        background: url('~@/assets/svg/play.svg') no-repeat center;
        background-size: contain;
        &:hover {
          transform: scale(1.1);
        }
      }
      &.pause {
        height: 27px;
        width: 20px;
        cursor: pointer;
        position: relative;
        background: url('~@/assets/svg/pause.svg') no-repeat center;
        background-size: contain;
        &:hover {
          transform: scale(1.1);
        }
      }
    }
    .time {
      display: flex;
      font-family: Poppins, sans-serif;
      font-size: 24px;
      width: 60px;

      > * {
        padding: 2px;
      }
    }
    .volume-container {
      cursor: pointer;
      .volume-button {
        height: 26px;
        display: flex;
        align-items: center;
        .volume {
          transform: scale(0.7);
        }
      }

      position: relative;
      z-index: 2;
      .volume-slider {
        position: absolute;
        left: -3px; top: 15px;
        z-index: -1;
        width: 0;
        height: 15px;
        background: white;
        box-shadow: 0 0 20px #000a;
        transition: .25s;
        .volume-percentage {
          background: coral;
          height: 100%;
          width: 75%;
        }
      }
      &:hover {
        .volume-slider {
          left: -123px;
          width: 120px;
        }
      }
    }
  }
}
@include media(">phone", "<=tablet") {
  .audio-player {
    width: 100%;
    padding: 0 5px;

    .timeline {
      width: 110px;
    }

    .controls {
      width: 100%;
      .time {
        font-size: 18px;
        width: 40px;
      }
      .toggle-play {
        &.play {
          height: 24px;
          width: 24px;
        }

        &.pause {
          height: 22px;
          width: 18px;
        }
      }
    }
  }



}
</style>
