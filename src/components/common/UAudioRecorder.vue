<template>
  <div>
    <UBtn @click="toggleRecord" size="x-large" class="ytt-recorder" color="blue" width="352">
      {{ isRecording ? 'Stop' : recordExists ? 'Overwrite' : 'Record' }}
      <div class="ytt-recorder__icon">
        <div v-if="isRecording" class="ytt-recorder__icon-recording"/>
        <svg
          v-if="!isRecording"
          v-svg
          :symbol="`icon-mic`"
          size="0 0 24 34"
        />
      </div>
    </UBtn>
  </div>
</template>

<script>
import AudioRecorder from '@/lib/AudioRecorder';

export default {
  name: 'UAudioRecorder',
  data: () => ({
    recorder: null,
    recordStatus: '',
    recordExists: false
  }),
  computed: {
    isRecording: function() { return this.recordStatus === 'recording'; }
  },
  mounted() {
    this.recorder = new AudioRecorder();
    this.recorder.onStatusChanged(this.recordingStatusChange);
  },
  methods: {
    recordingStatusChange(status){
      this.recordStatus = status;
      this.recordExists = Boolean(this.recorder.record);
      this.$emit('input', this.recorder.record);
      this.$emit('status-change', this.recordStatus);
    },
    startRecord(){
      this.recorder.start();
    },
    stopRecord(){
      this.recorder.stop();
    },
    toggleRecord(){
      this.isRecording ? this.stopRecord() : this.startRecord();
    }
  }
};
</script>

<style lang="scss" scoped>
@keyframes record {
  0%{
    transform: none;
  }
  50% {
    transform: scale(1.3);
  }
  100%{
    transform: none;
  }
}
@keyframes record-wave {
  0%{
    transform: none;
  }

  100%{
    opacity: 0;
    transform: scale(5);
  }
}


.ytt-recorder{
  position: relative;

  &__icon{
    position: absolute;
    top: 50%;
    right: 36px;
    transform: translateY(-50%);
    display: flex;

    &-recording{
      width: 24px;
      height: 24px;
      background-color: #e74c3c;
      border-radius: 50%;
      transform: none;
      animation: record 2s linear infinite;
      &:before{
        content: '';
        width: 24px;
        height: 24px;
        display: block;
        background-color: change-color(#e74c3c, $alpha: 0.5);
        border-radius: 50%;
        animation: record-wave 2s linear infinite;
      }
    }
  }

}

</style>
