<?php
    require_once __DIR__.'/require.php';
    function modifyCategoryBreadcrumb(){
        $catData    =   array();
        $categoryPathObject =   array();
        $catData    =   DB_Read(array('Table'=>'categoryinfo','Fields'=>'catId,catName,parentCat,anchorVideoId'),'ASSOC','','catId');
        
        if($catData){
            foreach($catData as $key => $value){
                if($value['parentCat'] == 0){
                    $categoryPathObject[$value['catId']]  =   $value['catName'];
                }
                else{
                    $categoryPathObject[$value['catId']] =   $categoryPathObject[$value['parentCat']].'/'.$value['catName'];
                }
            }
        }
        foreach($categoryPathObject as $key => $value){
            DB_Query('Update tempcuration set category_breadcrumb = "'.$value.'" where category = '.$key);
            DB_Query('Update contentinfo set category_breadcrumb = "'.$value.'" where category = '.$key);
        }
    }
    modifyCategoryBreadcrumb();
?>