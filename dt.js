document.addEventListener("DOMContentLoaded", function () {
    const filterButtons = document.querySelectorAll(".filter_buttons button");
    const productCards = document.querySelectorAll(".product_cards .card");
    const cartItems = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");
    const modal = document.getElementById("myModal");
    const checkoutBtn = document.getElementById("checkout-btn");
    const closeBtn = document.getElementsByClassName("close")[0];

    let totalPrice = 0;

    // Xử lý sự kiện cho các nút lọc
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            const filterValue = button.getAttribute("data-filter");

            // Xóa lớp 'active' khỏi tất cả các nút
            filterButtons.forEach(btn => btn.classList.remove("active"));

            // Thêm lớp 'active' vào nút được nhấp
            button.classList.add("active");

            // Hiển thị hoặc ẩn thẻ dựa trên giá trị bộ lọc
            productCards.forEach(card => {
                const cardFilter = card.getAttribute("data-filter");
                card.style.display = (filterValue === "all" || filterValue === cardFilter) ? "block" : "none";
            });
        });
    });

    // Xử lý sự kiện thêm vào giỏ hàng
    document.querySelectorAll(".btn.add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const productCard = this.parentElement;
            const productImg = productCard.querySelector("img").src;
            const productName = productCard.querySelector(".card_title").innerText;
            const productPrice = parseFloat(this.getAttribute("data-price").replace(/\./g, "")); // Chuyển đổi giá trị data-price thành số
            addCartItem(productImg, productName, productPrice);
        });
    });

    // Hàm thêm mặt hàng vào giỏ hàng
    function addCartItem(productImg, productName, productPrice) {
        const cartItem = document.createElement("tr");
        cartItem.innerHTML = `
            <td style="display: flex; align-items: center;">
                <img style="width: 70px;" src="${productImg}" alt="${productName}">
                <span>${productName}</span>
            </td>
            <td>
                <p><span>${formatCurrency(productPrice)}</span><sup>đ</sup></p>
            </td>
            <td>
                <input style="width: 30px; outline: none;" type="number" value="1" min="1">
            </td>
            <td style="cursor: pointer;">Xóa</td>
        `;
        cartItems.appendChild(cartItem);

        updateTotalPrice();

        cartItem.querySelector("input").addEventListener("input", function () {
            updateTotalPrice();
        });

        cartItem.querySelector("td:last-child").addEventListener("click", function () {
            removeCartItem(cartItem);
        });
    }

    // Hàm cập nhật tổng giá tiền
    function updateTotalPrice() {
        totalPrice = Array.from(cartItems.querySelectorAll("tr")).reduce((total, row) => {
            const itemPrice = parseFloat(row.querySelector("td:nth-child(2) span").innerText.replace(/\./g, "").replace(/[^0-9.-]+/g, ""));
            const itemQuantity = row.querySelector("input").value;
            return total + (itemPrice * itemQuantity);
        }, 0);
        totalPriceElement.textContent = formatCurrency(totalPrice);
    }

    // Hàm xóa mặt hàng khỏi giỏ hàng
    function removeCartItem(cartItem) {
        cartItems.removeChild(cartItem);
        updateTotalPrice();
    }

    // Hàm định dạng số tiền thành đơn vị đồng
    function formatCurrency(amount) {
        // Chuyển đổi số thành chuỗi và thêm dấu phân cách hàng nghìn
        let parts = amount.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        // Định dạng lại chuỗi số tiền và thêm đơn vị đồng
        return parts.join('.') + '';
    }

    // Xử lý đặt hàng
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function () {
            modal.style.display = "block";
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            modal.style.display = "none";
        });
    }

    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
