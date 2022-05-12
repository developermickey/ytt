import { mapActions, mapMutations } from "vuex";
// eslint-disable-next-line no-unused-vars
import { STUDENT, TEACHER } from "@/constants/roles";

export default {
    data: () => ({
        userSelectedForDeletion: null,
    }),
    methods: {
        ...mapActions('Products', ['deleteProduct', 'fetchProducts']),
        ...mapMutations('Students', [ 'DELETE_STUDENT' ]),
        ...mapMutations('Teachers', [ 'DELETE_TEACHER' ]),
        deleteProductAlert(user){
            this.userSelectedForDeletion = user;
            this.$alert({
                title: 'Are you sure you want to delete product?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                onConfirm: this.onConfirmDeleteProduct,
            });
        },
        onConfirmDeleteProduct(){
            this.deleteProduct(this.userSelectedForDeletion.id)
              .then(this.fetchProducts)
              .then(() => {
                this.userSelectedForDeletion = null;
                this.$notify({
                    title: 'Product successfully deleted',
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
