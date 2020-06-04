<template>
  <div class="vocabulary">

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
      @tbody-submenu-click-change-color="changeColorTbody"
      @tbody-submenu-click-change-value="changeValueTbody"
      @thead-submenu-click-change-color="changeColorThead"
      @thead-submenu-click-change-value="changeValueThead"
      @thead-td-sort="sortProduct">
    <div slot="header">
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

export default {
  name: 'vocabulary',
  data() {
    return {
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
      disableSortThead: ["a"],
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
          headerKey: "a",
          style: {
            width: "200px",
            minWidth: "200px",
            color: "#000"
          }
        },
        {
          headerName: "IPA",
          headerKey: "b",
          style: {
            width: "200px",
            minWidth: "200px",
            color: "#000"
          }
        },
        {
          headerName: "SoundsLike",
          headerKey: "c",
          style: {
            width: "200px",
            minWidth: "200px",
            color: "#000"
          }
        },
        {
          headerName: "DisplayAs",
          headerKey: "d",
          style: {
            width: "200px",
            minWidth: "200px",
            color: "#000"
          }
        }
      ],
      tbody: [
        {}
      ],
      submenuThead: [
        {
          type: "button",
          value: "change color",
          function: "change-color",
          disabled: ["a"]
        },
        {
          type: "select",
          disabled: ["a"],
          subtitle: "Select state:",
          selectOptions: [
            {
              value: "new-york",
              label: "new-york"
            },
            {
              value: "france",
              label: "france"
            }
          ],
          value: "new-york",
          buttonOption: {
            value: "change city",
            function: "change-city",
            style: {
              display: "block"
            }
          }
        },
        {
          type: "button",
          value: "change value",
          function: "change-value",
          disabled: ["a", "b"]
        }
      ],
      submenuTbody: [
        {
          type: "button",
          value: "change color",
          function: "change-color",
          disabled: ["img"]
        },
        {
          type: "button",
          value: "change value",
          function: "change-value",
          disabled: ["img", "name"]
        }
      ]
    };
  },
  components: {
    VueTable,
  },
  mounted() {
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    }, 300);
    this.tbody.push({})
  },
  methods: {
    checkedAllData(isChecked) {
      console.log('checked all data', isChecked)
    },
    checkedData(row) {
      console.log('checked data', row)
    },
    changeData(row, header) {
      console.log(row, header);
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
