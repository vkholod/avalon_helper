$(document).ready(function () {
    const jsonUrl = 'https://www.avaloncommunities.com/pf/api/v3/content/fetch/community-units?query=%7B%22arcSite%22%3A%22avalon-communities%22%2C%22bedroomNumber%22%3A%5B%222%22%5D%2C%22communityId%22%3A%22AVB-WA029%22%2C%22isMoveInDateFlexible%22%3Atrue%2C%22showFavorites%22%3Afalse%2C%22sortBy%22%3A%22LowestPrice%22%2C%22unitHasPromotion%22%3Afalse%7D&d=207&_website=avalon-communities';

    $.getJSON(jsonUrl, function (data) {
        const units = data.units;

        $('#units-header').text(`Available Units (${units.length})`);

        units.forEach(unit => {
            const unitParts = unit.unitId.split("-");
            const building = unitParts[2];
            const apartment = unitParts[3];

            const virtualTour = unit.virtualTour && unit.virtualTour.space
                ? `<a href="${unit.virtualTour.space}" target="_blank">View Tour</a>`
                : "N/A";

            const availableDate = new Date(unit.availableDateUnfurnished);
            const year = availableDate.getFullYear();
            const month = availableDate.toLocaleString('en-US', { month: 'short' });
            const day = availableDate.getDate().toString();
            const formattedDate = `${day} ${month} ${year}`;

            let score = 0;

            let floorClass;
            if (unit.floorNumber == 1) {
                floorClass = 'highlight-red';
                score -= 1;
            } else {
                floorClass = 'highlight-green';
                score += 2;
            }

            const price = parseFloat(unit.startingAtPricesUnfurnished.prices.price);
            let priceClass;
            if (price > 3200) {
                priceClass = 'highlight-red';
                score -= 3;
            } else if (price < 2800) {
                priceClass = 'highlight-green';
                score += 1;
            } else {
                priceClass = 'highlight-yellow';
            }

            let buildingClass;
            if (building.includes('04') || building.includes('06')) {
                buildingClass = 'highlight-green';
                score += 2;
            } else {
                buildingClass = 'highlight-yellow';
            }

            let squareFeetClass;
            if (unit.squareFeet < 1000) {
                squareFeetClass = 'highlight-red';
                score -= 3;
            } else if (unit.squareFeet > 1100) {
                squareFeetClass = 'highlight-green';
                score += 3;
            } else {
                squareFeetClass = 'highlight-yellow';
            }


            const row = `
                <tr>
                    <td>${score}</td>
                    <td class="${buildingClass}">${building}</td>
                    <td>${apartment}</td>
                    <td>
                        <a href="https://resource.avalonbay.com/${unit.floorPlan.highResolution}" target="_blank">
                            <img src="https://resource.avalonbay.com/${unit.floorPlan.lowResolution}">
                        </a>
                    </td>
                    <td class="${floorClass}">${unit.floorNumber}</td>
                    <td>${virtualTour}</td>
                    <td>${unit.bedroomNumber}</td>
                    <td class="${squareFeetClass}">${unit.squareFeet}</td>
                    <td>${formattedDate}</td>
                    <td class="${priceClass}">${price}</td>
                    <td>${unit.startingAtPricesUnfurnished.leaseTerm} months</td>
                </tr>
            `;
            $('#units-table tbody').append(row);
        });



        const table = $('#units-table').DataTable({
                pageLength: 50,
                lengthMenu: [10, 25, 50, 100],
                order: [
                    [0, 'desc'],
                    [7, 'desc'],
                ],
                orderCellsTop: true,
                initComplete: function () {
                    // Add filtering functionality to the second row
                    $('#units-table thead tr:eq(1) th').each(function (i) {
                        $('input', this).on('keyup change', function () {
                            if (table.column(i).search() !== this.value) {
                                table.column(i).search(this.value).draw();
                            }
                        });
                    });
                }
            });
    }).fail(function () {
        console.error("Failed to fetch JSON data.");
        alert("Unable to fetch data. Please check the JSON URL.");
    });
});