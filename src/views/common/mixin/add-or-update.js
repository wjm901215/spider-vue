import Modal from "@/components/modal/modal"

export default {
    props: {
        value: {
            required: true,
            type: Boolean
        }
    },
    created() {
        this.isShow = this.value
    },
    data() {
        return {
            isShow: false,
            canUpdate: false,
            isLoading: false,
        }
    },
    computed: {
        formDataTmp: {
            get() {
                return JSON.parse(JSON.stringify(this.formData))
            }
        }
    },
    watch: {
        value(val) {
            this.isShow = val;
        },
        isShow(val) {
            if (!val) {
                this.$refs.form.clearValidate();
                this.$refs.form.resetFields();
                this.canUpdate = false
            }
            this.$emit("input", val);
        },
        formDataTmp: {
            handler: function (val, oldVal) {
                if (val.id && oldVal.id && val.id == oldVal.id) {
                    this.canUpdate = true
                }
            },
            deep: true
        }
    },
    components: {
        Modal
    },
}
