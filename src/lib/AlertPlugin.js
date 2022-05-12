import UAlert from "@/components/common/UAlert/UAlert";

const AlertPlugin = {

    alert(alertProps, modalSettings, modalEvents){
        this.$modal.show(UAlert,
            alertProps,
            modalSettings,
            modalEvents,
        );
    },

    // eslint-disable-next-line no-unused-vars
    install(Vue, options){

        Vue.component('UAlert', UAlert);
        Vue.prototype.$alert = this.alert; //global method for all components

        Vue.alert = this.alert;

    }
}

export default AlertPlugin;
