

import {mapActions, mapGetters} from "vuex";

export default {
    data: () => ({
        name: '',
        phone: '',
        email: '',
        city: '',
        password: '',
        repeatPassword: '',
        avatar: null,
        role: 1,
    }),
    components: {
        // eslint-disable-next-line no-undef
        UTextField,
        // eslint-disable-next-line no-undef
        FileUpload,
    },
    computed: {
        ...mapGetters('Users', ['loading'])
    },
    methods: {
        ...mapActions('Users', {
            create : 'create'
        }),
        collectPostData(){
            let formData = {
                name: this.name,
                phone: this.phone,
                email: this.email,
                city: this.city,
                password: this.password,
                password_confirmation: this.repeatPassword,
                role: this.role
            };

            if(this.avatar){
                formData.avatar = this.avatar;
            }

            return formData;
        },
        submit(){
            let data = this.collectPostData();
            this.create(data)
                .then(() => {
                    this.$router.push({ name: 'admin-users-all' });
                    this.$notify({
                        title: 'User successfully created!',
                        type: 'success'
                    });
                })
                .catch(({ message }) => {
                    this.$notify({
                        title: 'User creation error',
                        text: message,
                        type: 'error'
                    });
                });
        },

    }
}
