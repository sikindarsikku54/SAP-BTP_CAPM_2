sap.ui.define([
    "sap/ui/test/opaQunit",
    "./pages/JourneyRunner"
], function (opaTest, runner) {
    "use strict";

    function journey() {
        QUnit.module("First journey");

        opaTest("Start application", function (Given, When, Then) {
            Given.iStartMyApp();

            Then.onTheProductsList.iSeeThisPage();
            Then.onTheProductsList.onFilterBar().iCheckFilterField("{i18n>Products.ID}");
            Then.onTheProductsList.onFilterBar().iCheckFilterField("{i18n>Products.description}");
            Then.onTheProductsList.onFilterBar().iCheckFilterField("category");
            Then.onTheProductsList.onFilterBar().iCheckFilterField("{i18n>Products.brand}");
            Then.onTheProductsList.onFilterBar().iCheckFilterField("{i18n>Products.price}");
            Then.onTheProductsList.onTable().iCheckColumns(5, {"ID":{"header":"{i18n>Products.ID}"},"description":{"header":"{i18n>Products.description}"},"catagory":{"header":"{i18n>Products.category}"},"brand":{"header":"{i18n>Products.brand}"},"price":{"header":"{i18n>Products.price}"}});

        });


        opaTest("Navigate to ObjectPage", function (Given, When, Then) {
            // Note: this test will fail if the ListReport page doesn't show any data
            
            When.onTheProductsList.onFilterBar().iExecuteSearch();
            
            Then.onTheProductsList.onTable().iCheckRows();

            When.onTheProductsList.onTable().iPressRow(0);
            Then.onTheProductsObjectPage.iSeeThisPage();

        });

        opaTest("Teardown", function (Given, When, Then) { 
            // Cleanup
            Given.iTearDownMyApp();
        });
    }

    runner.run([journey]);
});