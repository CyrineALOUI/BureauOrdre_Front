import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DossierService } from 'src/app/services/dossier.service';
import Swal from 'sweetalert2';
import * as pdfjsLib from 'pdfjs-dist';

@Component({
  selector: 'app-detail-dossier',
  templateUrl: './detail-dossier.component.html',
  styleUrls: ['./detail-dossier.component.scss']
})
export class DetailDossierComponent implements OnInit {
  dossier: any = {};
  enEdition = false;
  pdfs: any[] = [];

  constructor(private dossierService: DossierService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const idDossier = params['idDossier'];

      this.dossierService.getDossierById(idDossier).subscribe(data => {
        this.dossier = data;
      });

      this.dossierService.getPdfsByDossierId(idDossier).subscribe((data) => {
        this.pdfs = data;
        for (const pdf of this.pdfs) {
          this.loadPdf(pdf);
        }
      });
    });
  }

  activerEdition() {
    this.enEdition = true;
  }

  enregistrerModifications() {
    this.dossierService.updateDossier(this.dossier.idDossier, this.dossier)
      .subscribe(data => {
        this.enEdition = false;
      });
  }

  public deleteDossier(idDossier: number) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Êtes-vous sûr de vouloir supprimer ce dossier ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dossierService.deleteDossier(idDossier).subscribe(
          () => {
            this.router.navigate(['/list-dossiers']);
            Swal.fire('Dossier supprimé avec succès', '', 'success');
          },
          (error) => {
            console.log("Erreur lors de la suppression du dossier :", error);
            Swal.fire('Erreur', 'Une erreur est survenue lors de la suppression du dossier', 'error');
          }
        );
      }
    });
  }

  loadPdf(pdfs) {
    const pdfData = pdfs.pdfContent; // Assurez-vous que pdfContent contient les données du PDF

    const pdfContainer = document.getElementById('pdf-canvas'); // Récupère l'élément canvas par son ID

    const loadingTask = pdfjsLib.getDocument({ data: pdfData });
    loadingTask.promise.then((pdf) => {
      pdf.getPage(1).then((page) => {
        const scale = 1.5;
        const viewport = page.getViewport({ scale });

        // Rendre la page PDF sur le canvas
        const canvas = pdfContainer as HTMLCanvasElement;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        page.render({ canvasContext: context, viewport });
      });
    });
  }



}

