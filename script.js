// လစာအချက်အလက်များ သိမ်းဆည်းရန် Array
let salaryData = JSON.parse(localStorage.getItem("salaryData")) || [];

// Dashboard ကို Update လုပ်ခြင်း
function updateDashboard() {
  const otRate = 5.11;

  let totalIncome = 0;
  let totalAllotment = 0;
  let totalCash = 0;
  let totalNetUSD = 0;
  let totalNetMMK = 0;

  salaryData.forEach((item) => {
    const income = parseFloat(item.income) || 0;
    const otPay = (parseFloat(item.otHours) || 0) * otRate;
    const alloment = parseFloat(item.alloment) || 0;
    const boundStore = parseFloat(item.boundStore) || 0;
    const expense = parseFloat(item.expense) || 0;

    // Data တစ်ခုချင်းစီ၏ Rate ကို အသုံးပြု၍ တွက်ချက်ခြင်း
    const itemRate = parseFloat(item.rate) || 4000;

    // Total USD = Income + OT - Allotment - BoundStore - Expense
    const totalUSD = income + otPay - alloment - boundStore - expense;

    totalIncome += income + otPay;
    totalAllotment += alloment;
    totalCash += expense;
    totalNetUSD += totalUSD;
    // လအလိုက် Rate ဖြင့် MMK တွက်ချက်ခြင်း
    totalNetMMK += totalUSD * itemRate;
  });

  // USD Summary Update (ID များကို index.html နှင့် ကိုက်အောင် ပြင်ထားသည်)
  document.getElementById("incomeUSD").innerText = `$${totalIncome.toFixed(2)}`;
  document.getElementById("allotUSD").innerText =
    `$${totalAllotment.toFixed(2)}`;
  document.getElementById("cashUSD").innerText = `$${totalCash.toFixed(2)}`;
  document.getElementById("netUSD").innerText = `$${totalNetUSD.toFixed(2)}`;

  // MMK Summary Update
  document.getElementById("incomeMMK").innerText =
    `${(totalIncome * (parseFloat(document.getElementById("rate").value) || 4000)).toLocaleString()} MMK`;
  document.getElementById("allotMMK").innerText =
    `${(totalAllotment * (parseFloat(document.getElementById("rate").value) || 4000)).toLocaleString()} MMK`;
  document.getElementById("cashMMK").innerText =
    `${(totalCash * (parseFloat(document.getElementById("rate").value) || 4000)).toLocaleString()} MMK`;
  document.getElementById("netMMK").innerText =
    `${totalNetMMK.toLocaleString()} MMK`;

  renderTable();
}

// Table ကို Render လုပ်ခြင်း
function renderTable() {
  const tbody = document.getElementById("salaryBody");
  tbody.innerHTML = "";
  const otRate = 5.11;

  salaryData.forEach((item, index) => {
    const income = parseFloat(item.income) || 0;
    const otPay = (parseFloat(item.otHours) || 0) * otRate;
    const alloment = parseFloat(item.alloment) || 0;
    const boundStore = parseFloat(item.boundStore) || 0;
    const expense = parseFloat(item.expense) || 0;
    const total = income + otPay - alloment - boundStore - expense;

    tbody.innerHTML += `
            <tr class="border-b border-indigo-100">
                <td class="p-3">${item.month}</td>
                <td class="p-3 text-right">$${(income + otPay).toFixed(2)}</td>
                <td class="p-3 text-right">$${alloment.toFixed(2)}</td>
                <td class="p-3 text-right">$${boundStore.toFixed(2)}</td>
                <td class="p-3 text-right">$${expense.toFixed(2)}</td>
                <td class="p-3 text-right">$${total.toFixed(2)}</td>
                <td class="p-3 text-center">
                    <button onclick="deleteData(${index})" class="text-red-500 hover:text-red-700">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
  });
}

// Data အသစ်ထည့်ခြင်း
function addData() {
  const data = {
    month: document.getElementById("month").value,
    income: document.getElementById("income").value,
    alloment: document.getElementById("alloment").value,
    boundStore: document.getElementById("boundStore").value,
    otHours: document.getElementById("otHours").value,
    expense: document.getElementById("expense").value,
    rate: document.getElementById("rate").value,
  };

  if (data.month && data.income) {
    salaryData.push(data);
    localStorage.setItem("salaryData", JSON.stringify(salaryData));
    updateDashboard();

    // Input များကို ရှင်းလင်းခြင်း
    document.getElementById("month").value = "";
    document.getElementById("income").value = "";
    document.getElementById("alloment").value = "";
    document.getElementById("boundStore").value = "";
    document.getElementById("otHours").value = "";
    document.getElementById("expense").value = "";
  } else {
    alert("ကျေးဇူးပြု၍ လိုအပ်သောအချက်အလက်များကို ဖြည့်စွက်ပါ။");
  }
}

function deleteData(index) {
  salaryData.splice(index, 1);
  localStorage.setItem("salaryData", JSON.stringify(salaryData));
  updateDashboard();
}

function clearData() {
  if (confirm("အချက်အလက်များ အားလုံးကို ဖျက်ပစ်မှာ သေချာပါသလား?")) {
    salaryData = [];
    localStorage.removeItem("salaryData");
    updateDashboard();
  }
}

window.onload = updateDashboard;
