<template>
 <div> 
   <a-button type="primary" @click="queryData">获取数据</a-button>
   <a-button type="primary" @click="openDialog">新增组合</a-button>
   <a-button type="primary" @click="calComb">计算组合</a-button>
   <a-table :dataSource="dataSource"   :pagination="pagination">
     <a-table-column title="组合id"  data-index="id"/>
     <a-table-column title="组合名称"  data-index="name"/>
     <a-table-column title="组合转债" width="200px" :ellipsis="true"  data-index="itemName"/>
     <a-table-column title="上一工作日" data-index="lastOneDay">
        <template #default="{ record }">
          {{record.lastOneDay.increase}}
        </template>
      </a-table-column>
     <a-table-column title="组合个数"  data-index="num"/>
     <a-table-column key="create_time" title="创建时间" data-index="create_time" />
     <a-table-column  title="操作" fixed>
        <template #default="{ record }">
          <a-button type="text" @click="goEditComb(record.id)"> 修改</a-button>
          <a-button type="text" @click="deleteComb(record.id)"> 删除</a-button>
        </template>
      </a-table-column>

   </a-table>
   <a-modal
      v-model:visible="visible"
      title="新增组合"
      @ok="handleOk"
      width="60%"
      wrapClassName="full-modal"
    >
      <a-input v-model:value="formProps.name" />
      <a-input v-model:value="formProps.remarks" />
    </a-modal>
  </div> 

 </template>

<script setup>
import {ref,reactive,h} from 'vue'
import { get_all_comb,get_jsl_data,edit_comb,cal_comb} from '@/api/convertible';
import { useRoute, useRouter } from 'vue-router';
import dayjs from 'dayjs';
const queryData = async ()=>{
  get_jsl_data()
}
let dataSource = ref([])
let visible = ref(false)
let pagination = ref({
  pageSize:20
})
let formProps = reactive({
  name:'',
  remarks:'',
})
let columns = ref([
  {
    title: '组合名称',
    dataIndex: 'name',
    key: 'name',
   
  },
  {
    title: '组合转债',
    dataIndex: 'itemName',
    width:"100px",
    ellipsis:true
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
  },
])
const router = useRouter();

function openDialog(){
  visible.value = true
}
async function handleOk(){
  let add_id = await edit_comb(formProps)
  goEditComb(add_id)
}

async function getCombData(){
  let res = await get_all_comb()
  dataSource.value = res.map(v=>{
    

    return {
      ...v,
      num:v.bonds.length,
      itemName:v.bonds.map(v=>v.bond_nm).toString(),
      create_time:dayjs(v.create_time).format('YYYY-MM-DD'),
      lastOneDay:v.increases[0],
      lastTwoDay:v.increases[1],
      lastThreeDay:v.increases[2],
    }
  })
}
function goEditComb(id){
  router.push({name:'convertible-comb',params:{id}})
}
async function calComb(){
   let res = await cal_comb()
}
getCombData()
</script>   
