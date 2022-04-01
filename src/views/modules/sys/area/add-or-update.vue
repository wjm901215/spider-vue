<template>
  <modal v-model="isShow" width="500px">
    <el-form :model="formData" ref="form" label-width="100px" :rules="rules">
      <div>
        <div class="i-box">
          <div class="i-box-title">
            <icon-svg name="line"></icon-svg>
            {{ $t('area.modal.title') }}
            <h5>{{ $t('common.tip') }}<span>*</span>{{ $t('common.tippp') }}</h5>
          </div>
          <div class="i-box-conn">
            <el-row>
              <el-row>
                <el-form-item prop="id">
                  <input v-model="formData.id" type="hidden">
                </el-form-item>
                <el-col :span="24" v-show="formData.id">
                  <el-form-item label="位置">
                    <el-input v-model="formData.name" disabled></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-show="!formData.id">
                  <el-form-item prop="provinceCode" label="省" clearable>
                    <el-select filterable v-model="formData.provinceCode" placeholder="省"
                               @change="handleCitys"
                               style="width:100%">
                      <el-option v-for="row in provinces" :key="row.regionCode"
                                 :value="row.regionCode"
                                 :label="row.regionName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-show="!formData.id">
                  <el-form-item prop="cityCode" label="市" clearable>
                    <el-select filterable v-model="formData.cityCode" placeholder="市"
                               @change="handleRegions"
                               style="width:100%">
                      <el-option v-for="row in citys" :key="row.city" :value="row.regionCode"
                                 :label="row.regionName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-show="!formData.id">
                  <el-form-item prop="regionCode" label="区" clearable>
                    <el-select filterable v-model="formData.regionCode" placeholder="区"
                               style="width:100%">
                      <el-option v-for="row in regions" :key="row.regionCode"
                                 :value="row.regionCode"
                                 :label="row.regionName">
                      </el-option>
                    </el-select>
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
                    <br/> {{ $t('common.mapInfo') }}
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-form-item prop="remark" :label="$t('common.remark')">
                    <el-input type="textarea" :row="2" v-model="formData.remark"
                              :placeholder="$t('common.remark')"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-row>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer">
      <el-button type="info" @click="isShow = false;">{{ $t('common.cancel') }}</el-button>
      <el-button type="success" @click="submit">{{ $t('common.complete') }}</el-button>
    </div>
    <map-dialog ref="mapDialog" @change="getPosition"></map-dialog>
  </modal>
</template>

<script>
import Modal from "@/components/modal/modal"
import MapDialog from "_cm/map-dialog"
import {save, regionNationalList} from "@/api/sys/area";
import {clone} from "@/utils";

export default {
  props: {
    value: {
      required: true,
      type: Boolean
    }
  },
  watch: {
    value(val) {
      this.isShow = val
      if (!val) {
        this.restForm()
      }
    },
    isShow(val) {
      this.$emit("input", val)
    }
  },
  data() {
    return {
      isShow: false,
      formDataBak: {},
      parentCode: '',
      parentName: '',
      regions: [],
      provinces: [],
      citys: [],
      formData: {
        provinceCode: '',
        cityCode: '',
        regionCode: '',
        province: '',
        id: '',
        tenantId: '',
        name: '',
        code: '',
        parentId: '',
        level: '',
        longitudeBaidu: '',
        latitudeBaidu: '',
        longitudeGaode: '',
        latitudeGaode: '',
        orderNum: '',
        remark: ''
      },
      rules: {
        provinceCode: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        cityCode: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        regionCode: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        tenantId: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        name: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        longitudeGaode: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        latitudeGaode: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        orderNum: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
      }
    }
  },
  components: {
    Modal,
    MapDialog
  },
  created() {
    this.isShow = this.value
    this.loadRegion(1, null, list => {
      this.provinces = list
    })
  },
  methods: {
    restForm() {
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.save()
        }
      })
    },
    handleCitys() {
      this.loadRegion(2, this.formData.provinceCode, list => this.citys = list)
      this.formData.cityCode = ''
      this.formData.regionCode = ''
    },
    handleRegions() {
      this.loadRegion(3, this.formData.cityCode, list => this.regions = list)
      this.formData.regionCode = ''
    },
    loadRegion(level, parentCode, callback) {
      regionNationalList({
        level,
        parentCode
      }).then(({data}) => {
        callback(data.list)
      })
    },
    initAdd(parentId, parentName, level, parentCode) {
      this.restForm()
      this.formData.parentId = parentId
      this.parentName = parentName
      this.formData.level = ++level
      this.parentCode = parentCode
    },
    initUpdate(row) {
      this.rules.cityCode[0].required=false
      this.rules.provinceCode[0].required=false
      this.rules.regionCode[0].required=false
      this.parentName = row.parentName
      this.formData.id = row.id
      this.formData.tenantId = row.tenantId
      this.formData.name = row.name
      this.formData.code = row.code
      this.formData.parentId = row.parentId
      this.formData.level = row.level
      this.formData.longitudeBaidu = row.longitudeBaidu
      this.formData.latitudeBaidu = row.latitudeBaidu
      this.formData.longitudeGaode = row.longitudeGaode
      this.formData.latitudeGaode = row.latitudeGaode
      this.formData.orderNum = row.orderNum
      this.formData.remark = row.remark
    },
    openMapDialog() {
      this.$refs.mapDialog.open(this.formData.longitudeGaode, this.formData.latitudeGaode)
    },
    getPosition(postion) {
      this.formData.longitudeGaode = postion[0]
      this.formData.latitudeGaode = postion[1]
    },
    save() {
      save({
        'id': this.formData.id || undefined,
        'name': this.formData.name,
        'code': this.formData.id ? this.formData.code : this.parentCode + '' + this.formData.code,
        'provinceCode': this.formData.provinceCode,
        'cityCode': this.formData.cityCode,
        'regionCode': this.formData.regionCode,
        'longitudeGaode': this.formData.longitudeGaode,
        'latitudeGaode': this.formData.latitudeGaode,
        'orderNum': this.formData.orderNum,
        'remark': this.formData.remark
      }).then(({data}) => {
        if (data && data.code === 200) {
          this.$message({
            message: this.$t('common.successTip'),
            type: "success",
            duration: 1500,
            onClose: () => {
              this.isShow = false
              this.$emit("change")
              this.restForm()
            }
          })
        }
      }).catch(err => {
        this.$message.error(err)
      })
    }
  }
}

</script>
