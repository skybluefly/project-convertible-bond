<template>
  <div>
     <a-button @click="submit">提交</a-button>
     <a-row>
       <a-col :span="2">
          组合转债：
       </a-col>
       <a-col :span="22">
           <a-tag 
            v-for="v in showCombList" 
            closable :key="v.bond_id"
            @close="deleteBond(v.bond_id)"
            >
            {{v.bond_nm}}
          </a-tag>
       </a-col>
     </a-row>
    
    
     <a-table 
     :dataSource="state.dataSource" 
     :columns="columns" 
     :pagination="false"
     :row-selection="{ selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange }"
     />
  </div>
</template>
<script setup>
import {ref,reactive, h,computed} from 'vue'
import { get_all_data,edit_comb,get_comb} from '@/api/convertible';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const columns = ref([
  {
    title: '股票代码',
    dataIndex: 'bond_id',
  },
  {
    title: '转债名称',
    dataIndex: 'bond_nm',
  },
  {
    title: '现价',
    dataIndex: 'price',
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: '涨跌幅',
    dataIndex: 'increase_rt',
    sorter: (a, b) => a.increase_rt - b.increase_rt,
    customRender:({text})=>{
      return h('span',{},text+'%')
    }
  },
  {
    title: '转股溢价率',
    dataIndex: 'premium_rt',
    sorter: (a, b) => a.premium_rt - b.premium_rt,
    customRender:({text})=>{
      return h('span',{},text+'%')
    }
  },
  {
    title: '双低',
    dataIndex: 'dblow',
    sorter: (a, b) => a.dblow - b.dblow,
   
  },
  {
    title: '剩余年限',
    dataIndex: 'year_left',
    sorter: (a, b) => a.year_left - b.year_left,
   
  },
  {
    title: '剩余规模',
    dataIndex: 'curr_iss_amt',
    sorter: (a, b) => a.curr_iss_amt - b.curr_iss_amt,
  },
  {
    title: '转股价',
    dataIndex: 'convert_price',
    sorter: (a, b) => a.convert_price - b.convert_price,
  },

  {
    title: '转股价值',
    dataIndex: 'convert_value',
    sorter: (a, b) => a.convert_value - b.convert_value,
  },
  {
    title: '正股pb',
    dataIndex: 'pb',
    sorter: (a, b) => a.pb - b.pb,
  },
   {
    title: '流通市值占比',
    dataIndex: 'convert_amt_ratio',
    sorter: (a, b) => a.convert_amt_ratio - b.convert_amt_ratio,
    customRender:({text})=>{
      return h('span',{},text+'%')
    }
  },

  


  
  {
    title: '正股名称',
    dataIndex: 'stock_nm',
  },
  {
    title: '正股涨跌',
    dataIndex: 'premium_rt',
    sorter: (a, b) => a.sincrease_rt - b.sincrease_rt,
    customRender:({text})=>{
      return h('span',{},text+'%')
    }
  },
  
])


const state = reactive({
  selectedRowKeys:[],
  dataSource:[],
  currentComb:{}
})

const showCombList = computed(() => {
  return state.dataSource.filter(v=>state.selectedRowKeys.includes(v.bond_id))
});

async function queryData(){
  let data= await get_all_data()
  let currentComb = await get_comb(route.params.id)
  state.currentComb = currentComb

  state.dataSource = data.map((v,i)=>({...v,key:v.bond_id}))
  if(currentComb.convertibles){
    state.selectedRowKeys = currentComb.convertibles.split(',').map(v=>Number(v))
  }


}

function onSelectChange(selectedRowKeys){
  console.log(selectedRowKeys)
  state.selectedRowKeys = selectedRowKeys;
}
const submit = async ()=>{
  let form = {
    convertibles:state.selectedRowKeys.toString(),
    id:route.params.id,
  }
  await edit_comb(form)
}

const deleteBond = (id)=>{
  state.selectedRowKeys = state.selectedRowKeys.filter(v=>v!=id)
}

queryData()













</script>