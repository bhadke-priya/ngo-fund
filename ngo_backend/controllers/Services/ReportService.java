

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.ngo.model.*;
import com.ngo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final DonationRepository donationRepo;
    private final ExpenditureRepository expenditureRepo;
    private final NGORepository ngoRepo;

    public byte[] generatePDF(Long ngoId) throws Exception {
        NGO ngo = ngoRepo.findById(ngoId).orElseThrow();
        List<Donation> donations =
            donationRepo.findByCampaignNgoNgoId(ngoId);
        List<Expenditure> expenditures =
            expenditureRepo.findByCampaignNgoNgoId(ngoId);

        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, out);
        document.open();

        // Title
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
        document.add(new Paragraph("NGO Audit Report", titleFont));
        document.add(new Paragraph("NGO: " + ngo.getName()));
        document.add(new Paragraph(
            "Generated On: " + java.time.LocalDate.now()
        ));
        document.add(Chunk.NEWLINE);

        // Donations Table
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
        document.add(new Paragraph("Donations Received", headerFont));
        document.add(Chunk.NEWLINE);

        PdfPTable donationTable = new PdfPTable(4);
        donationTable.addCell("Donor");
        donationTable.addCell("Campaign");
        donationTable.addCell("Amount");
        donationTable.addCell("Date");

        for (Donation d : donations) {
            donationTable.addCell(d.getDonor().getName());
            donationTable.addCell(d.getCampaign().getTitle());
            donationTable.addCell("Rs. " + d.getAmount());
            donationTable.addCell(d.getDonatedOn().toString());
        }
        document.add(donationTable);
        document.add(Chunk.NEWLINE);

        // Expenditures Table
        document.add(new Paragraph("Expenditures", headerFont));
        document.add(Chunk.NEWLINE);

        PdfPTable expTable = new PdfPTable(4);
        expTable.addCell("Campaign");
        expTable.addCell("Description");
        expTable.addCell("Amount");
        expTable.addCell("Date");

        for (Expenditure e : expenditures) {
            expTable.addCell(e.getCampaign().getTitle());
            expTable.addCell(e.getDescription());
            expTable.addCell("Rs. " + e.getAmount());
            expTable.addCell(e.getSpentOn().toString());
        }
        document.add(expTable);
        document.close();

        return out.toByteArray();
    }
}