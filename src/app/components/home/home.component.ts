import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  isLoggedIn: boolean = true;
  gridItems: number[] = Array(36).fill(0); // Default grid size (6x6)
  selectedSquares: Set<number> = new Set(); // Set to keep track of selected squares
  isCtrlPressed: boolean = false; // To detect if Ctrl is pressed
  isShiftPressed: boolean = false; // To detect if Shift is pressed
  isAltPressed: boolean = false; // To detect if Alt is pressed
  shiftStartIndex: number | null = null; // To track the first square selected for Shift/Alt+Click

  ngOnInit() {
    this.checkLoginStatus();
    this.addKeyListeners(); // Add event listeners for detecting Ctrl, Shift, and Alt key presses
  }

  private checkLoginStatus() {
    const user = sessionStorage.getItem('user');
    this.isLoggedIn = !!user;
  }

  logout() {
    sessionStorage.clear();
    this.isLoggedIn = false;
    this.router.navigate(['login']);
  }

  // Handle square selection logic
  selectSquare(index: number, event: MouseEvent) {
    const gridWidth = Math.sqrt(this.gridItems.length); // Assuming a square grid

    if (this.isAltPressed && this.shiftStartIndex !== null) {
      // Alt + Click: Select columns between A and B, limited to rows between A and B
      const startRow = Math.floor(this.shiftStartIndex / gridWidth);
      const endRow = Math.floor(index / gridWidth);
      const startColumn = this.shiftStartIndex % gridWidth;
      const endColumn = index % gridWidth;

      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);
      const minCol = Math.min(startColumn, endColumn);
      const maxCol = Math.max(startColumn, endColumn);

      this.selectedSquares.clear(); // Clear previous selection

      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          this.selectedSquares.add(row * gridWidth + col);
        }
      }
    } else if (this.isShiftPressed && this.shiftStartIndex !== null) {
      // Shift + Click: Select all squares between A and B
      const start = Math.min(this.shiftStartIndex, index);
      const end = Math.max(this.shiftStartIndex, index);
      this.selectedSquares.clear();

      for (let i = start; i <= end; i++) {
        this.selectedSquares.add(i);
      }
    } else if (this.isCtrlPressed) {
      // Ctrl + Click: Toggle individual square selection
      if (this.selectedSquares.has(index)) {
        this.selectedSquares.delete(index); // Deselect
      } else {
        this.selectedSquares.add(index); // Select
      }
    } else {
      // Regular click: Clear selection and select only the clicked square
      this.selectedSquares.clear();
      this.selectedSquares.add(index);
      this.shiftStartIndex = index; // Set start index for Shift/Alt+Click
    }
  }

  // Detect when the Ctrl, Shift, or Alt keys are pressed or released
  private addKeyListeners() {
    window.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        this.isCtrlPressed = true;
      } else if (event.key === 'Shift') {
        this.isShiftPressed = true;
      } else if (event.key === 'Alt') {
        this.isAltPressed = true;
      }
    });

    window.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        this.isCtrlPressed = false;
      } else if (event.key === 'Shift') {
        this.isShiftPressed = false;
      } else if (event.key === 'Alt') {
        this.isAltPressed = false;
      }
    });
  }

  // Add squares to the grid
  addSquares(count: string) {
    const number = parseInt(count, 10);
    if (isNaN(number) || number <= 0) {
      alert('Please enter a valid positive integer');
      return;
    }
    this.gridItems = [...this.gridItems, ...Array(number).fill(0)];
  }
}
