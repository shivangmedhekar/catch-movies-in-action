const confirmButton = document.getElementById('confirm-btn');

confirmButton.addEventListener('click', e => {

    const form = document.createElement("form");
    const purchaseSummary = document.createElement("input");

    form.method = "POST";
    form.action = "/order/checkout";

    purchaseSummary.value = JSON.stringify(orderSummary);
    purchaseSummary.type = 'hidden'
    purchaseSummary.name = "orderSummary";
    form.appendChild(purchaseSummary);

    document.body.appendChild(form);

    form.submit();
})