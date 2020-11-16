var data;
var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    data = JSON.parse(this.responseText);
    categoriesName(data.categories)
    provinceName(data.provinces)
    priceRange(data.priceRange)
    contentGenerator(data.merchants, "ทั้งหมด")
  }
};
xmlhttp.open("GET", "ywc18.json", true);
xmlhttp.send();

function categoriesName(data) {
    let txt = `<div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="ทั้งหมด" value="ทั้งหมด" name="type" checked>
                    <label class="custom-control-label" for="ทั้งหมด">ทั้งหมด</label>
                </div>`;
    data.forEach(function(d) {
        txt += `<div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="${d.name}" value="${d.name}" name="type">
                    <label class="custom-control-label" for="${d.name}">${d.name}</label>
                </div>`;
    });
    document.getElementById("categories").innerHTML = txt;
}

function provinceName(data) {
    let txt = `<option>
                    <svg width="16" height="20" viewBox="0 0 14 20" fill="none" class="mr-2"><path d="M7 0C3.13 0 0 3.13 0 7c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" fill="#000"></path></svg>
                    <span>พื้นที่ใกล้ฉัน</span>
                </option>
                <option>
                    <svg width="20" height="30" viewBox="0 0 25 30" fill="none" style="margin-right: 6px;"><path d="M9 22l-.371.335.371.411.371-.41L9 22zm0 0l.371.335h0l.002-.002.004-.005.016-.017a4.45 4.45 0 00.02-.023l.04-.045c.053-.06.13-.147.227-.26a46.982 46.982 0 003.235-4.235c.884-1.31 1.776-2.797 2.448-4.297C16.032 11.957 16.5 10.413 16.5 9c0-4.146-3.354-7.5-7.5-7.5A7.495 7.495 0 001.5 9c0 1.414.468 2.957 1.137 4.45.672 1.5 1.564 2.988 2.449 4.298a46.985 46.985 0 003.521 4.563l.016.017.004.005.001.002h0L9 22zm0-11a2 2 0 110-4 2 2 0 010 4z" fill="#222" stroke="#fff"></path><path d="M16 28l-.371.335.371.411.371-.41L16 28zm0 0l.371.335h0l.002-.002.004-.005.016-.017a3.037 3.037 0 00.06-.068c.053-.06.13-.147.227-.26a46.982 46.982 0 003.235-4.235c.884-1.31 1.776-2.797 2.448-4.297.669-1.494 1.137-3.037 1.137-4.451 0-4.146-3.354-7.5-7.5-7.5A7.495 7.495 0 008.5 15c0 1.414.468 2.957 1.137 4.45.672 1.5 1.564 2.988 2.448 4.298a46.982 46.982 0 003.522 4.563l.016.017.004.005.001.002h0L16 28zm0-11a2 2 0 110-4 2 2 0 010 4z" fill="#222" stroke="#fff"></path></svg>
                    <span>สถานที่ทั้งหมด</span>
                </option>`;
    data.forEach(function(d) {
        txt += `<option>${d}</option>`
    });
    document.getElementById("provincesNav").innerHTML = txt;
    document.getElementById("provinces").innerHTML = txt;
}

function priceRange(data) {
    let txt = `<option>ทั้งหมด</option>`;
    data.forEach(function(d) {
        txt += `<option>${d}</option>`
    });
    document.getElementById("priceRange").innerHTML = txt;
}

function contentGenerator(data, keyword) {
    let titleCheck = $('input[name="type"]:checked').val();
    if(titleCheck != "ทั้งหมด") document.getElementById("TitlePage").innerHTML = `<b>ผลการค้นหา ${titleCheck} ทั้งหมด</b>`;
    else document.getElementById("TitlePage").innerHTML = `<b>ผลการค้นหา ทั้งหมด</b>`;

    let txt = "";
    data.forEach(function(d) {
        if(d.subcategoryName == keyword || keyword == "ทั้งหมด" || keyword.includes(d.subcategoryName)) {
            let listRecommend = d.recommendedItems.join(", ");
            txt += `<div class="card p-2 mb-2 py-2 border-info">
                        <div class="row">
                            <div class="col-md-3 col-12">
                                <img src="${d.coverImageId}" class="img_store">
                            </div>
                            <div class="col-md-9 col-12 pt-2 choiceSize">
                                <h6><b>${d.shopNameTH}</b>`
            if(d.isOpen == "Y") {
                txt += `<span class="ml-3 badge badge-success">เปิดอยู่</span>`
            } else if(d.isOpen == "N") {
                txt += `<span class="ml-3 badge badge-secondary">ปิดแล้ว</span>`
            }
            txt += `</h6><p>${d.subcategoryName} | ฿฿฿฿ | ${d.addressDistrictName} ${d.addressProvinceName}</p>
                                <hr class="w-100">
                                <p>${d.highlightText}</p>
                                <p><b>เมนูแนะนำ: </b> ${listRecommend}</p>
                            </div>
                        </div>
                    </div>`;
        }
    });
    document.getElementById("allContent").innerHTML = txt;

    if(document.getElementById("allContent").childNodes.length != 0) {
        document.getElementById("moreBTN").innerHTML = '<button class="btn btn-light border w-50 py-2 my-4">ดูเพิ่มเติม</button>';
    } else {
        document.getElementById("moreBTN").innerHTML = '';
    }
}

function subCategory() {
    let listOfSubcategories = "";
    let txt = `<div class="custom-control custom-radio">
                    <input type="radio" class="custom-control-input" id="รวมทั้งหมด" value="ทั้งหมด" name="category" checked>
                    <label class="custom-control-label" for="รวมทั้งหมด">ทั้งหมด</label>
                </div>`;
    let keyword = $('input[name="type"]:checked').val();
    data.categories.forEach(function(t) {
        if(t.name == keyword) {
            listOfSubcategories = t.subcategories;
            t.subcategories.forEach(function(s) {
                txt += `<div class="custom-control custom-radio">
                            <input type="radio" class="custom-control-input" id="${s}" value="${s}" name="category">
                            <label class="custom-control-label" for="${s}">${s}</label>
                        </div>`;
            });
        }
    });
    document.getElementById("subCategories").innerHTML = txt;
    if(listOfSubcategories) contentGenerator(data.merchants, listOfSubcategories);
    else contentGenerator(data.merchants, "ทั้งหมด");
}

function fliterContent() {
    let keyword = $('input[name="category"]:checked').val();
    if(keyword != "ทั้งหมด") {
        contentGenerator(data.merchants, keyword);
    }
    else {
        let listOfSubcategories = "";
        keyword = $('input[name="type"]:checked').val();
        data.categories.forEach(function(t) {
            if(t.name == keyword) {
                listOfSubcategories = t.subcategories;
            }
        });
        if(listOfSubcategories) contentGenerator(data.merchants, listOfSubcategories);
        else contentGenerator(data.merchants, "ทั้งหมด");
    }
}