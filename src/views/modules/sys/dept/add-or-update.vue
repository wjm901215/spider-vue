<template>
  <modal v-model="isShow" width="500px">
    <el-form :model="formData" ref="form" label-width="100px" :rules="rules">
      <div>
        <div class="i-box">
          <div class="i-box-title">
            <icon-svg name="line"></icon-svg>
            {{ $t("dept.modal.title") }}
            <h5>{{ $t("common.tip") }}<span>*</span>{{ $t("common.tippp") }}</h5>
          </div>
          <div class="i-box-conn">
            <el-row>
              <el-form-item prop="id">
                <input v-model="formData.id" type="hidden">
              </el-form-item>
              <el-col :span="24" v-if="formData.parentId != -1">
                <el-form-item prop="parentId" :label="$t('common.parentName')" clearable>
                  {{ parentName }}
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="name" :label="$t('dept.column.deptName')">
                  <el-input v-model="formData.name"
                            :placeholder="$t('dept.column.deptName')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="shortName" :label="$t('dept.column.shortName')">
                  <el-input v-model="formData.shortName"
                            :placeholder="$t('dept.column.shortName')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="orderNum" :label="$t('common.orderNum')">
                  <el-input-number v-model="formData.orderNum" style="width:100%" :min="1"
                                   :label="$t('common.orderNum')"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="16" v-if="formData.id">
                <el-form-item prop="code" label="部门编码">
                  <el-input v-model="formData.code" style="width:100%" label="部门编码"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16">
                <el-col :span="24">
                  <el-form-item prop="longitudeGaode" :label="$t('common.longitude')">
                    <el-input v-model="formData.longitudeGaode"
                              :placeholder="$t('common.inputLongitude')"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item prop="latitudeGaode" :label="$t('common.latitude')">
                    <el-input v-model="formData.latitudeGaode"
                              :placeholder="$t('common.inputLatitude')"></el-input>
                  </el-form-item>
                </el-col>
              </el-col>
              <el-col :span="8" class="map_location">
                <el-button plain type="primary" @click="openMapDialog()">
                  <icon-svg name="map"></icon-svg>
                  <br/> {{ $t("common.mapInfo") }}
                </el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item prop="remark" :label="$t('common.remark')">
                  <el-input type="textarea" :rows="2" v-model="formData.remark"
                            :placeholder="$t('common.remark')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer">
      <el-button type="info" @click="isShow = false;restForm()">{{ $t('common.cancel') }}</el-button>
      <el-button type="success" @click="submit">{{ $t('common.complete') }}</el-button>
    </div>
    <map-dialog ref="mapDialog" @change="getPosition"></map-dialog>
  </modal>
</template>

<script>
import Modal from "@/components/modal/modal"
import MapDialog from "_cm/map-dialog"
import {saveOrUpdate} from "@/api/common";

export default {
  props: {
    value: {
      required: true,
      type: Boolean
    }
  },
  watch: {
    value(val) {
      this.isShow = val;
      if (!val) {
        this.restForm()
      }
    },
    isShow(val) {
      this.$emit("input", val);
    }
  },
  data() {
    return {
      isShow: false,
      parentName: '',
      tenants: [],
      formData: {
        id: "",
        name: "",
        shortName: "",
        code: "",
        parentId: "",
        orderNum: 1,
        longitudeBaidu: "",
        latitudeBaidu: "",
        longitudeGaode: "",
        latitudeGaode: "",
        level: "",
        remark: "",
      },
      rules: {
        name: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: "blur"
        }],
        shortName: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: "blur"
        }],
        parentId: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: "blur"
        }],
        code: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: "blur"
        }],
        orderNum: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: "blur"
        }],
        longitudeGaode: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: "blur"
        }],
        latitudeGaode: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: "blur"
        }],
        level: [{
          required: true,
          message: this.$t('dept.modal.inputLevelTip'),
          trigger: "blur"
        }],
      }
    };
  },
  components: {
    Modal,
    MapDialog
  },
  methods: {
    getPosition(postion) {
      this.formData.longitudeGaode = postion[0]
      this.formData.latitudeGaode = postion[1]
    },
    restForm() {
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.save();
        }
      });
    },
    openMapDialog() {
      this.$refs.mapDialog.open(this.formData.longitudeGaode, this.formData.latitudeGaode);
    },
    initAdd(parentId, parentName, level) {
      this.formData.parentId = parentId;
      this.parentName = parentName;
      this.formData.level = ++level
    },
    initUpdate(row) {
      this.formData.id = row.id;
      this.formData.name = row.name;
      this.parentName = row.parentName;
      this.formData.shortName = row.shortName;
      this.formData.code = row.code;
      this.formData.parentId = row.parentId;
      this.formData.orderNum = row.orderNum;
      this.formData.longitudeBaidu = row.longitudeBaidu;
      this.formData.latitudeBaidu = row.latitudeBaidu;
      this.formData.longitudeGaode = row.longitudeGaode;
      this.formData.latitudeGaode = row.latitudeGaode;
      this.formData.level = row.level;
      this.formData.remark = row.remark;
    },
    save() {
      saveOrUpdate({
        id: this.formData.id || undefined,
        name: this.formData.name,
        shortName: this.formData.shortName,
        code: this.formData.code,
        parentId: this.formData.parentId,
        orderNum: this.formData.orderNum,
        longitudeBaidu: this.formData.longitudeBaidu,
        latitudeBaidu: this.formData.latitudeBaidu,
        longitudeGaode: this.formData.longitudeGaode,
        latitudeGaode: this.formData.latitudeGaode,
        level: this.formData.level,
        deleted: this.formData.deleted,
        createBy: this.formData.createBy,
        createTime: this.formData.createTime,
        updateBy: this.formData.updateBy,
        updateTime: this.formData.updateTime,
        remark: this.formData.remark
      },'/sys/dept').then(({data}) => {
        if (data && data.code === 200) {
          this.$message({
            message: this.$t('common.successTip'),
            type: "success",
            duration: 1500,
            onClose: () => {
              this.isShow = false;
              this.$emit("refresh");
              this.restForm();
            }
          })
        }
      }).catch(errMsg => this.$message.error(errMsg))
    }
  }
};

</script>
<style>

</style>
