sap.ui.define([
    "sap/m/MessageToast",
    "sap/ui/core/Fragment"
], function (MessageToast, Fragment) {
    "use strict";

    const mView = new WeakMap();
    const CommentsColumnHandler = {

        async onOpenCommentsPopover(oEvent) {

            MessageToast.show("Opening Comments Popover...");

            const oSource = oEvent.getSource();

            let oView = oSource;
            while (
                oView &&
                !(oView.isA && oView.isA("sap.ui.core.mvc.View"))
            ) {
                oView = oView.getParent && oView.getParent();
            }

            const oBindingContext = oSource.getBindingContext();

            const sPopoverFragmentName =
                "bootcamphelpdeskfiori.bootcamphelpdeskfiori.ext.fragment.CustomCommentsPopover";

            if (!oBindingContext) {
                console.error("No row context available to open popover.");
                return;
            }

            let oPopover = mView.get(oView);

            if (oPopover) oPopover.setBindingContext(null);

            try {

                if (!oPopover) {
                    oPopover = await Fragment.load({
                        name: sPopoverFragmentName,
                        controller: CommentsColumnHandler
                    });

                    oView.addDependent(oPopover);
                    mView.set(oView, oPopover);
                }

                // Set the binding context on the Popover
                await oPopover.setBindingContext(oBindingContext);

                await new Promise(function (resolve) {
                    setTimeout(resolve, 1000);
                });

                // CRITICAL STEP: Anchor and open
                oPopover.openBy(oSource);
            } catch (error) {
                console.error(
                    "Failed to load or open comments popover:",
                    error
                );
            }
        }

    };

    return CommentsColumnHandler;
});
