document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-transaction-form');
    const historyList = document.getElementById('transaction-history');
    const balanceEl = document.getElementById('current-balance');
    const incomeEl = document.getElementById('total-income');
    const expenseEl = document.getElementById('total-expense');

    let transactions = [];

    // Fungsi Pembantu untuk format mata uang IDR
    const formatter = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    });

    // 1. Fungsi Perhitungan dan Update UI
    function updateSummary() {
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const balance = totalIncome - totalExpense;

        balanceEl.textContent = formatter.format(balance);
        incomeEl.textContent = formatter.format(totalIncome);
        expenseEl.textContent = formatter.format(totalExpense);
    }

    // 2. Fungsi Render Transaksi ke Riwayat
    function renderTransactions() {
        historyList.innerHTML = '';

        transactions.forEach(t => {
            const li = document.createElement('li');
            const sign = t.type === 'income' ? '+' : '-';
            const colorClass = t.type === 'income' ? 'income-row' : 'expense-row';
            
            // Tampilan Gambar Bukti (jika ada)
            let imageHtml = '';
            if (t.imageData) {
                 imageHtml = `
                    <div class="history-image-container">
                        <img src="${t.imageData}" alt="Bukti" class="history-image">
                    </div>
                `;
            }

            li.className = `transaction-item ${colorClass}`;
            li.innerHTML = `
                <div class="history-details">
                    <strong>${t.description}</strong>
                    <span class="history-date">${new Date(t.date).toLocaleDateString()}</span>
                </div>
                <div class="history-amount">${sign} ${formatter.format(t.amount)}</div>
                ${imageHtml}
            `;
            historyList.appendChild(li);
        });
        updateSummary();
    }

    // 3. Handler Submit Formulir (Termasuk Logika Gambar)
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const type = document.getElementById('type').value;
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const imageFile = document.getElementById('image-upload').files[0];
        
        let imageData = null;

        if (imageFile) {
            // Logika untuk membaca file gambar ke Base64 (string data)
            const reader = new FileReader();
            reader.onload = function(event) {
                imageData = event.target.result;
                addTransaction(type, description, amount, imageData);
            };
            reader.readAsDataURL(imageFile);
        } else {
            addTransaction(type, description, amount, imageData);
        }
    });
// ... (semua kode di atas fungsi addTransaction) ...

    // Fungsi Inti Penambahan Transaksi (DIPERBARUI)
    function addTransaction(type, description, amount, imageData) {
        if (isNaN(amount) || amount <= 0) return;

        const newTransaction = {
            id: Date.now(),
            type,
            description,
            amount,
            date: new Date().toISOString(),
            imageData
        };

        transactions.unshift(newTransaction); // Gunakan unshift agar transaksi baru di atas
        
        form.reset(); 

        // 1. Render ulang tampilan
        renderTransactions();
        
        // 2. Tambahkan animasi scanning pada item pertama (yang baru ditambahkan)
        const newItem = historyList.querySelector('.transaction-item');
        if (newItem) {
            newItem.classList.add('scanning');
            // Hapus kelas 'scanning' setelah animasi selesai
            setTimeout(() => {
                newItem.classList.remove('scanning');
            }, 800); 
        }
    }

// ... (sisa kode di bawah fungsi addTransaction) ...
    
});
