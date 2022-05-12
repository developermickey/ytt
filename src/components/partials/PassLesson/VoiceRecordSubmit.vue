<template>
  <div class="voice-record-submit">
    <div class="record-wrap">
      <UAudioRecorder
        v-model="record"
        class="voice-record-submit__ytt-recorder"
        @status-change="onRecordStatusChange"
      />
      <UBtn
        class="voice-record-submit__submit"
        :disabled="disabledSubmit"
        width="352"
        size="x-large"
        color="primary"
        @click="onSubmit"
        :loading="loading"
      >
        Send
      </UBtn>
    </div>
    <div>
      <UAudioPlayer :value="audio" v-if="record"/>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import UAudioRecorder from "@/components/common/UAudioRecorder";
import UAudioPlayer from "@/components/common/UAudioPlayer";

export default {
  components: {
    UAudioRecorder,
    UAudioPlayer
  },
  props: {
    //used in record submit
    knownWords: {
      type: Boolean,
      default: null,
    }
  },
  data: () => ({
    record: null,
    disabledSubmit: true,
  }),
  computed: {
    ...mapGetters('Lessons', ['loading']),
    audio(){ return window.URL.createObjectURL(this.record); }
  },
  methods: {
    ...mapActions('Lessons', ['sendRecord']),
    onRecordStatusChange(status) {

      if (status === 'inactive') {
        this.disabledSubmit = false;
      }
      if (status === 'recording') {
        this.disabledSubmit = true;
      }

      this.$emit('record-status-change', status);
    },
    onSubmit() {
      let params = {
        lessonId: this.$route.params.id,
        record: this.record,
      };
      if(this.knownWords !== null ){
        params.known_words = this.knownWords;
      }

      this.sendRecord(params).then(() => {
        this.$notify({
          title: 'Success',
          message: 'Your answer was successfully sent to teacher',
          type: 'success'
        });
        this.$emit('after-submit');
        this.$modal.show('reply-sent');
      }).catch(({message}) => {
        this.$notify({
          title: 'Pass lesson error',
          text: message,
          type: 'error'
        });
      });
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/mixins";
.voice-record-submit{
  display: flex;
  flex-direction: column;

  & > div{
    display: flex;
    justify-content: center;
    &:first-child{
      margin-bottom: 24px;
    }
  }

  &__ytt-recorder,
  &__submit{
    margin-right: 36px;
    margin-left: 36px;
  }
}
@include media(">phone", "<=tablet") {
  .record-wrap{
    display: flex;
    flex-direction: column;
  }
  .voice-record-submit__submit{
    margin-top: 10px;
  }

}
</style>
