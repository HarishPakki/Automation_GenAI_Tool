const staticData = {
  AD: {
    ObjectControls: {
      Common: "Select * from AD_Controls where ApplicationName='AD' and ValueStream='Common'",
      CG: "Select * from AD_Controls where ApplicationName='AD' and ValueStream='CG'",
      SF: "Select * from AD_Controls where ApplicationName='AD' and ValueStream='SF'",
      PF: "Select * from AD_Controls where ApplicationName='AD' and ValueStream='PF'"
    },
    TestData: {
      CG: "Table1",
      SF: "Table2",
      PF: "Table1, Table2"
    },
    ReusableLibraries: {
      Common: "",
      CG: "",
      SF: "",
      PF: ""
    },
    TestCases: {
      CG: "TestCase1, TestCase2",
      SF: "TestCase1, TestCase2",
      PF: "TestCase1, TestCase2"
    },
    Execution: {
      CG: "Execution Flow 1, Execution Flow 2",
      SF: "Execution Flow 1, Execution Flow 2",
      PF: "Execution Flow 1, Execution Flow 2"
    }
  }
};

export default staticData;
