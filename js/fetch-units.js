$(document).ready(function () {
    const jsonUrl = 'https://www.avaloncommunities.com/pf/api/v3/content/fetch/community-units?query=%7B%22arcSite%22%3A%22avalon-communities%22%2C%22bedroomNumber%22%3A%5B%222%22%5D%2C%22communityId%22%3A%22AVB-WA029%22%2C%22isMoveInDateFlexible%22%3Atrue%2C%22showFavorites%22%3Afalse%2C%22sortBy%22%3A%22LowestPrice%22%2C%22unitHasPromotion%22%3Afalse%7D&d=207&_website=avalon-communities';

    $.getJSON(jsonUrl, function (data) {
        const units = data.units;

        units.forEach(unit => {
                const unitParts = unit.unitId.split("-");
                const building = unitParts[2];
                const apartment = unitParts[3];


            const virtualTour = unit.virtualTour && unit.virtualTour.space
                ? `<a href="${unit.virtualTour.space}" target="_blank">View Tour</a>`
                : "N/A";

            const row = `
                <tr>
                    <td>${building}</td>
                    <td>${apartment}</td>
                    <td>
                        <a href="https://resource.avalonbay.com/${unit.floorPlan.highResolution}" target="_blank">
                            <img src="https://resource.avalonbay.com/${unit.floorPlan.lowResolution}">
                        </a>
                    </td>
                    <td>${unit.floorNumber}</td>
                    <td>${virtualTour}</td>
                    <td>${unit.bedroomNumber}</td>
                    <td>${unit.bathroomNumber}</td>
                    <td>${unit.squareFeet}</td>
                    <td>${new Date(unit.availableDateUnfurnished).toISOString().split('T')[0]}</td>
                    <td>$${unit.startingAtPricesUnfurnished.prices.price}</td>
                    <td>${unit.startingAtPricesUnfurnished.leaseTerm} months</td>
                </tr>
            `;
            $('#units-table tbody').append(row);
        });



        const table = $('#units-table').DataTable({
                pageLength: 50,
                lengthMenu: [10, 25, 50, 100],
                order: [
                    [7, 'desc']
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