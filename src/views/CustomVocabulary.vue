<template>
  <div class="vocabulary">

    <el-form ref="form" :inline="true" :model="form" label-width="180px">

      <el-form-item label="Vocabulary Name">
        <el-select v-model="selectedVocabularyId" placeholder="Select">
          <el-option
            v-for="item of vocabularyList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="publishToS3(selectedVocabularyId)">Publish to S3</el-button>
      </el-form-item>

      <el-form-item>
        <el-button type="danger" :disabled="(selectedVocabularyName === 'default')" @click="deleteVocabulary(selectedVocabularyId)">Delete Vocabulary</el-button>
      </el-form-item>

      <el-form-item label="Create New Vocabulary">
        <el-input v-model="form.newVocabularyName"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :disabled="(form.newVocabularyName === 'default')" @click="createVocabulary(form.newVocabularyName)">Creste Vocabulary</el-button>
      </el-form-item>

    </el-form>

    <vue-table
      :tbody-data="tbody"
      :headers="headers"
      :custom-options="customOptions"
      :style-wrap-vue-table="styleWrapVueTable"
      :disable-cells="disableCells"
      :disable-sort-thead="disableSortThead"
      :loading="loading"
      :parent-scroll-element="parentScrollElement"
      :select-position="selectPosition"
      :submenu-tbody="submenuTbody"
      :submenu-thead="submenuThead"
      @tbody-checked-row="checkedData"
      @tbody-all-checked-row="checkedAllData"
      @tbody-change-data="changeData"
      @tbody-submenu-click-add-row="addRow"
      @tbody-submenu-click-change-value="changeValueTbody"
      @thead-submenu-click-change-color="changeColorThead"
      @thead-submenu-click-change-value="changeValueThead"
      @thead-td-sort="sortProduct">

      <div slot="header">
        <el-button type="primary" :disabled="(tbody.length >= 100)" @click="addRow()">Add Row</el-button>
        <el-button type="danger" :disabled="(tbody.length <= 1)" @click="deleteRow()">Delete Row</el-button>
        Specific Header
      </div>
      <div slot="loader">
        Loader
      </div>
    </vue-table>

  </div>
</template>

<script>
import VueTable from "vuejs-spreadsheet";
import { API, graphqlOperation, Storage } from 'aws-amplify';
import * as queries from '../graphql/queries';
import * as mutations from '../graphql/mutations';
import * as subscriptions from '../graphql/subscriptions';

export default {
  name: 'vocabulary',
  data() {
    return {
      subscription: {},
      selectedVocabularyId: '',
      selectedVocabularyName: '',
      vocabularyList: [],
      //selectedTableName: '',
      //vocabularyTables: [],
      form: {
        newVocabularyName: '',
      },
      customOptions: {
        tbodyIndex: true,
        tbodyCheckbox: true,
        sortHeader: true,
        trad: {
          lang: "ja",
          en: {
            select: {
              placeholder: "Search by typing"
            }
          },
          ja: {
            select: {
              placeholder: "ほげ"
            }
          }
        },
        newData: {
          type: "input",
          value: "",
          active: false,
          style: {
            color: "#000"
          }
        },
        fuseOptions: {
          shouldSort: true,
          threshold: 0.2,
          location: 0,
          distance: 30,
          maxPatternLength: 64,
          minMatchCharLength: 1,
          findAllMatches: false,
          tokenize: false,
          keys: ["value"]
        }
      },
      loading: false,
      disableCells: [],
      parentScrollElement: {
        attribute: "html",
        positionTop: 0
      },
      selectPosition: {
        top: 0,
        left: 0
      },
      disableSortThead: ["phrase", "ipa", "soundsLike", "displayAs"],
      styleWrapVueTable: {
        height: "400px",
        overflow: "visible",
        fontSize: "12px",
        comment: {
          borderColor: "#696969",
          borderSize: "8px",
          widthBox: "120px",
          heightBox: "80px"
        }
      },
      headers: [
        {
          headerName: "Phrase",
          headerKey: "phrase",
          style: {
            width: "200px",
            minWidth: "200px",
            color: "#000"
          }
        },
        {
          headerName: "IPA",
          headerKey: "ipa",
          style: {
            width: "200px",
            minWidth: "200px",
            color: "#000"
          }
        },
        {
          headerName: "SoundsLike",
          headerKey: "soundsLike",
          style: {
            width: "200px",
            minWidth: "200px",
            color: "#000"
          }
        },
        {
          headerName: "DisplayAs",
          headerKey: "displayAs",
          style: {
            width: "200px",
            minWidth: "200px",
            color: "#000"
          }
        }
      ],
      tbody: [],
      submenuThead: [],
      submenuTbody: [
        {
          type: 'button',
          value: 'Add Row',
          function: 'add-row',
          disabled: ['img']
        }
      ]
    };
  },
  components: {
    VueTable,
  },
  watch: {
    selectedVocabularyId: function (vocabularyId) {
      this.selectedVocabularyName = this.vocabularyList.find(x => x.id === vocabularyId).name;
      for (let item in this.subscription) {
        this.subscription[item].unsubscribe();
      }
      // Get sheet data
      API.graphql(graphqlOperation(queries.listVocabularySheets, {vocabularyId: vocabularyId}))
        .then((res) => {
          const items = res.data.listVocabularySheets.items
          const tbody = []
          for (let item of items) {
            tbody[item.row] = this.genRowData(item)
          }
          this.tbody = tbody
        })
        .catch((err) => console.log(JSON.stringify(err)));
      // Subscriptions
      this.subscription.create = API.graphql(graphqlOperation(subscriptions.onCreateVocabularySheet, {vocabularyId: vocabularyId})).subscribe({
        next: (eventData) => {
          const item = eventData.value.data.onCreateVocabularySheet;
          const rowData = this.genRowData(item)
          this.$set(this.tbody, item.row, rowData);
        }
      });
      this.subscription.update = API.graphql(graphqlOperation(subscriptions.onUpdateVocabularySheet, {vocabularyId: vocabularyId})).subscribe({
        next: (eventData) => {
          const item = eventData.value.data.onUpdateVocabularySheet;
          const rowData = this.tbody[item.row]
          for (let k of ['phrase', 'ipa', 'soundsLike', 'displayAs']) {
            rowData[k].value = item[k]
          }
          this.$set(this.tbody, item.row, rowData);
        }
      });
      this.subscription.delete = API.graphql(graphqlOperation(subscriptions.onDeleteVocabularySheet, {vocabularyId: vocabularyId})).subscribe({
        next: (eventData) => {
          const item = eventData.value.data.onDeleteVocabularySheet;
          this.tbody.splice(item.row, item.row);
        }
      });
    }
  },
  beforeDestroy() {
    for (let item in this.subscription) {
      this.subscription[item].unsubscribe();
    }
  },
  mounted() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 300);
    API.graphql(graphqlOperation(queries.listVocabularys))
      .then((data) => {
        this.vocabularyList = data.data.listVocabularys.items;
        this.selectedVocabularyId = this.vocabularyList.find(x => x.name === 'default').id;
      })
      .catch((err) => console.log(JSON.stringify(err)));
  },
  methods: {
    genRowData(item) {
      const rowData = {
        phrase: {
          type: 'input',
          value: item.phrase,
          active: false,
          style: {
            color: '#000',
          },
        },
        ipa: {
          type: 'input',
          value: item.ipa,
          active: false,
          style: {
            color: '#000',
          },
        },
        soundsLike: {
          type: 'input',
          value: item.soundsLike,
          active: false,
          style: {
            color: '#000',
          },
        },
        displayAs: {
          type: 'input',
          value: item.displayAs,
          active: false,
          style: {
            color: '#000',
          },
        }
      }
      return rowData
    },
    async createVocabulary(vocabularyName) {
      const data = await API.graphql(graphqlOperation(mutations.createVocabulary, { input: { name: vocabularyName } }))
        .catch((err) => console.log(JSON.stringify(err)));
      const newVocabulary = data.data.createVocabulary
      const input = {
        vocabularyId: newVocabulary.id,
        row: 0,
        phrase: '',
        ipa: '',
        soundsLike: '',
        displayAs: '',
      }
      await API.graphql(graphqlOperation(mutations.createVocabularySheet, {input: input}))
        .catch((err) => console.log(JSON.stringify(err)));
      this.vocabularyList.push(newVocabulary);
      this.selectedVocabularyId = newVocabulary.id;
    },
    deleteVocabulary(vocabularyId) {
      const input = {id: vocabularyId}
      API.graphql(graphqlOperation(mutations.deleteVocabulary, {input: input}))
        .catch((err) => console.log(JSON.stringify(err)));
      this.selectedVocabularyId = this.vocabularyList.find(x => x.name === 'default').id;
    },
    addRow() {
      if (this.tbody.length < 100) {
        const input = {
          vocabularyId: this.selectedVocabularyId,
          row: this.tbody.length,
          phrase: '',
          ipa: '',
          soundsLike: '',
          displayAs: '',
        }
        API.graphql(graphqlOperation(mutations.createVocabularySheet, {input: input}))
          .catch((err) => console.log(JSON.stringify(err)));
      }
    },
    deleteRow() {
      const input = {
        vocabularyId: this.selectedVocabularyId,
        row: this.tbody.length - 1,
      }
      API.graphql(graphqlOperation(mutations.deleteVocabularySheet, {input: input}))
        .catch((err) => console.log(JSON.stringify(err)));
    },
    checkedAllData(isChecked) {
      console.log('checked all data', isChecked)
    },
    checkedData(row) {
      console.log('checked data', row)
    },
    changeData(row, header) {
      const input = {
        vocabularyId: this.selectedVocabularyId,
        row: row
      }
      input[header] = this.tbody[row][header].value  // Todo: delete キー押した際に古い value が取れてしまう問題
      API.graphql(graphqlOperation(mutations.updateVocabularySheet, {input: input}))
        .catch((err) => console.log(JSON.stringify(err)));
    },
    sortProduct(event, header, colIndex) {
      console.log(event, header, colIndex)
      console.log('sort product');
    },
    // callback
    changeColorThead(event, header, colIndex) {
      this.headers[colIndex].style.color = '#e40000';
    },
    changeValueThead(event, header, colIndex) {
      this.headers[colIndex].headerName = 'T-shirt';
    },
    changeColorTbody(event, header, rowIndex, colIndex) {
      console.log(colIndex)  // for Lint
      this.tbody[rowIndex][header].style = {};
      this.tbody[rowIndex][header].style.color = '#e40000';
    },
    changeValueTbody(event, header, rowIndex, colIndex) {
      console.log(colIndex)  // for Lint
      this.rows[rowIndex][header].value = 'T-shirt';
    },
    async publishToS3(vocabularyId) {
      const fileName = `vocabulary/${vocabularyId}/input.txt`;
      let body = 'Phrase \tIPA\tSoundsLike\tDisplayAs\n';
      for (let row of this.tbody) {
        body += `${row.phrase.value}\t${row.ipa.value}\t${row.soundsLike.value}\t${row.displayAs.value}\n`
      }
      Storage.put(fileName, body)
        .then (result => console.log(result))
        .catch(err => console.log(err));
    }
  },
};
</script>

<!--
<style lang="scss">
::-moz-selection {
  color: #2c3e50;
  background: transparent;
}
::selection {
  color: #2c3e50;
  background: transparent;
}
</style>-->
