import { mapActions, mapMutations } from "vuex";
// eslint-disable-next-line no-unused-vars
import {STUDENT, TEACHER } from "@/constants/roles";

export default {
    data: () => ({
        userSelectedForDeletion: null,
    }),
    methods: {
        ...mapActions('Users', ['deleteUser']),
        ...mapMutations('Students', [ 'DELETE_STUDENT' ]),
        ...mapMutations('Teachers', [ 'DELETE_TEACHER' ]),
        deleteUserAlert(user){
            this.userSelectedForDeletion = user;
            this.$alert({
                title: 'Are you sure you want to delete user?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                onConfirm: this.onConfirmDeleteUser,
            },{width: this.deviceWidth > 1250 ? "1250px" : '100%', shiftX: this.deviceWidth > 1250 ? '50%' : 0 });
        },
        onConfirmDeleteUser(){
            this.deleteUser({
                userId: this.userSelectedForDeletion.id,
            }).then(() => {
                if(this.userSelectedForDeletion.role_id === TEACHER)
                    this.DELETE_TEACHER({ teacherId: this.userSelectedForDeletion.id });
                else
                    this.DELETE_STUDENT({ studentId: this.userSelectedForDeletion.id });


                this.userSelectedForDeletion = null;
                this.$notify({
                    title: 'User successfully deleted',
                    type: 'success'
                });
            }).catch(({ message }) => {
                this.userSelectedForDeletion = null;
                this.$notify({
                    title: "Error",
                    text: message,
                    type: 'error'
                });
            })
        }
    }
}
