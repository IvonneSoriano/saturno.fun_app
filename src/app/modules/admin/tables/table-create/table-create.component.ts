import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

import { AdminService } from '../../admin.service';
import { Table, TableResponse } from '../../../../interfaces/table.interface';
import { LoginService } from '../../../../services/login.service';
import { SharedService } from '../../../../services/shared.service';
import { Section } from '../../../../interfaces/section.interface';

@Component({
	selector: 'app-table-create',
	templateUrl: './table-create.component.html',
	styleUrls: ['./table-create.component.css']
})
export class TableCreateComponent implements OnInit {
	@Output() tableCreated: EventEmitter<Table> = new EventEmitter();
	@Output() sectionChanged: EventEmitter<Section> = new EventEmitter();
	@Input() sections: Section[] = [];
	@Input() tablesSection: Table[] = [];

	forma: FormGroup;
	constructor(
		public adminService: AdminService,
		private loginService: LoginService,
		private sharedService: SharedService,
		private snack: MatSnackBar
	) { }

	ngOnInit(): void {
		this.forma = new FormGroup({
			idSection: new FormControl(null, Validators.required),
			nmTable: new FormControl(null, Validators.required),
			nmPersons: new FormControl(null, Validators.required),
		});
	}

	createTable(formDirective: FormGroupDirective) {
		if (this.forma.invalid) {
			return;
		}

		// verifico que el número de mesa no exista dentro del sector.
		for ( let table of this.tablesSection ) {
			if (this.forma.controls.nmTable.value === table.nm_table) {
				this.sharedService.snack('Ya existe una mesa con el id: ' + table.nm_table + ' !', 3000);
				return;
			}
		}

		const table: Table = {
			id_section: this.forma.value.idSection,
			nm_table: this.forma.value.nmTable,
			nm_persons: this.forma.value.nmPersons
		};

		this.adminService.createTable(table).subscribe((data: TableResponse) => {
			this.tableCreated.emit(data.table);
			this.snack.open(data.msg, null, { duration: 5000 });
			this.resetForm(formDirective);

			// persist selected section option on select control
			this.forma.patchValue({idSection: data.table.id_section})
			
		})
	}

	resetForm(formDirective: FormGroupDirective) {
		formDirective.resetForm();
		this.sharedService.scrollTop();
	}

	sectionChange(section: Section): void {
		this.sectionChanged.emit(section);
	}
}
