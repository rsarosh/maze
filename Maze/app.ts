class Cell {
    private left: Boolean;
    private right: Boolean;
    private top: Boolean;
    private bottom: Boolean;
    private cellSize: number;
    private canvas: CanvasRenderingContext2D;
    private x1:number = 0;
    private y1: number = 0;
    private visited: boolean = false;
    private row: number;
    private col: number;
    private color: string = "#000000";

    constructor(left: boolean, right: boolean, top: boolean, bottom: boolean,
                canvas: CanvasRenderingContext2D, row: number, col: number,
                cellsize:number) {
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
        this.cellSize = cellsize;
        this.canvas = canvas;
        this.row = row;
        this.col = col;
    }

    public getRow(): number{
        return this.row;
    }

    public getCol (): number{
        return this.col;
    }

    public isVisited(): Boolean {
        return this.visited;
    }

    public markVisited() {
        this.visited = true;
    }
        
    public clearTop() {
        this.top = false;
    }

    public clearBottom() {
        this.bottom = false;
    }

    public clearLeft() {
        this.left = false;
    }

    public clearRight() {
        this.right = false;
    }

    drawCell(row: number, col: number) {
        this.x1 = col * (this.cellSize) ;
        this.y1 = row * (this.cellSize) ;
        this.drawTop();
        this.drawLeft();
        this.drawBottom();
        this.drawRight();
        
    }
    private drawTop() {
        if (!this.top) {
            return;
        }
        var x1 = this.x1;
        var y1 = this.y1;
        var x2 = x1 + this.cellSize;
        var y2 = y1;
        this.drawLine(x1, y1, x2, y2);
    }
    private drawBottom() {
        if (!this.bottom) {
            return;
        }
        var x1 = this.x1 ;
        var y1 = this.y1 + this.cellSize;
        var x2 = x1 + this.cellSize;
        var y2 = y1 ;
        this.drawLine(x1, y1, x2, y2);
    }
    private drawLeft() {
        if (!this.left) {
            return;
        }
        var x1 = this.x1;
        var y1 = this.y1;
        var x2 = x1;
        var y2 = y1 + this.cellSize;
        this.drawLine(x1, y1, x2, y2);
    }
    private drawRight() {
        if (!this.right) {
            return;
        }
        var x1 = this.x1 + this.cellSize;
        var y1 = this.y1 ;
        var x2 = x1;
        var y2 = y1 + this.cellSize;
        this.drawLine(x1, y1, x2, y2);
        
    }
    private drawLine(x1: number, y1: number, x2: number, y2: number, color: string = "#000000") {
        this.canvas.beginPath();
        this.canvas.moveTo(x1, y1);
        this.canvas.lineTo(x2, y2);
        this.canvas.lineWidth = 3;
        this.canvas.strokeStyle = color;
        this.canvas.stroke();
    }
}

class Maze {
   
    private canvas: CanvasRenderingContext2D;
    private maze: Cell[][];
    private mazeSize: number;
    private cellHeightWidth: number;
    
    constructor(element: HTMLCanvasElement, mazeSize: number, cellHeightWidth:number) {
        this.canvas = element.getContext("2d");
        this.mazeSize = mazeSize;
        this.cellHeightWidth = cellHeightWidth;
        this.maze = this.createMaze(mazeSize, mazeSize);
    }

    drawMaza() {
        for (var i = 0; i < this.maze.length; i++) {
            for (var j = 0; j < this.maze[i].length; j++) {
                var cell = this.maze[i][j];
                cell.drawCell(i, j);
            }
        }
    }
    
    start() {
        var check = new Array();
        var stack = new Array();
        var r = 0;
        var c = 0;

        //open the top of first cell
        this.maze[r][c].clearTop();
        //open the bottom of the last cell
        this.maze[this.mazeSize - 1][this.mazeSize - 1].clearBottom();
 
        var curentCell: Cell = this.maze[r][c];
        while (true) {
         
            if (curentCell) {
                r = curentCell.getRow();
                c = curentCell.getCol();
                this.maze[r][c].markVisited();
                check = [];
                //Check the cell neighbours and if not visited keep them for the next move
                if (c > 0 && !this.maze[r][c - 1].isVisited()) {
                    check.push('L')
                }
                if (r > 0 && !this.maze[r - 1][c].isVisited()) {
                    check.push('U')
                }
                if (c < this.mazeSize - 1 && !this.maze[r][c + 1].isVisited()) {
                    check.push('R')
                }
                if (r < this.mazeSize - 1 && !this.maze[r + 1][c].isVisited()) {
                    check.push('D')
                }

                if (check.length > 0) {
                    //put the cell on stack
                    stack.push(this.maze[r][c]);
                    //choose a neighbour randomely

                    var move_direction;
                    if (check.length > 1) {
                        var rand = this.GetRandomNumber(check.length);
                        if (rand === check.length)
                            rand = rand - 1;
                        move_direction = check[rand];
                    } else {
                        move_direction = check[0];
                    }

                    if (move_direction === 'L') {
                        this.maze[r][c].clearLeft();
                        c = c - 1;
                        this.maze[r][c].clearRight();
                    }
                    if (move_direction === 'U') {
                        this.maze[r][c].clearTop();
                        r = r - 1;
                        this.maze[r][c].clearBottom();
                    }
                    if (move_direction === 'R') {
                        this.maze[r][c].clearRight();
                        c = c + 1
                        this.maze[r][c].clearLeft();
                    }
                    if (move_direction === 'D') {
                        this.maze[r][c].clearBottom();
                        r = r + 1
                        this.maze[r][c].clearTop();
                    }
                    //move the currentCell to the next selected cell
                    curentCell = this.maze[r][c]; 
                } else {
                    curentCell = stack.pop();
                }
            } else {
                break;
            }
        } //~while finishes
        this.drawMaza();
    }

    GetRandomNumber(maxNumber: number) {
        return Math.floor((Math.random() * maxNumber) );
    }

    createMaze(rows: number, col: number): Cell[][] {
        var arr: Cell[][]  =  new Array(rows);
        for (var i = 0; i < rows; i++) {
            arr[i] = new Array(col);
            for (var j = 0; j < col; j++) {
                var cell: Cell = new Cell(true, true, true, true, this.canvas, i, j, this.cellHeightWidth);
                arr[i][j]= cell;
            }
        }
        return arr;
    }
}

window.onload = () => {
       var el: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('content');
       var maze = new Maze(el,20,50);
       maze.start();
};